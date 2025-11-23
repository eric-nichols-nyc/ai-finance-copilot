'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import {
  deleteTransactionSchema,
  type DeleteTransactionInput,
} from '@/lib/validations/transaction'

type DeleteTransactionSuccess = {
  success: true
  message: string
}

type DeleteTransactionError = {
  success: false
  error: string
  fieldErrors?: Record<string, string[]>
}

export type DeleteTransactionResult = DeleteTransactionSuccess | DeleteTransactionError

// Helper function to calculate balance impact
function calculateBalanceImpact(
  accountType: string,
  transactionType: string,
  amount: number
): number {
  if (accountType === 'CREDIT_CARD' || accountType === 'LOAN') {
    // For credit cards and loans:
    // - EXPENSE/INTEREST_CHARGE increases balance (you owe more)
    // - INCOME/LOAN_PAYMENT decreases balance (you pay off debt)
    if (transactionType === 'EXPENSE' || transactionType === 'INTEREST_CHARGE') {
      return amount
    } else if (transactionType === 'INCOME' || transactionType === 'LOAN_PAYMENT') {
      return -amount
    }
  } else {
    // For checking and savings:
    // - INCOME increases balance
    // - EXPENSE decreases balance
    if (transactionType === 'INCOME') {
      return amount
    } else if (transactionType === 'EXPENSE') {
      return -amount
    }
  }
  return 0
}

export async function deleteTransaction(
  input: DeleteTransactionInput
): Promise<DeleteTransactionResult> {
  try {
    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()

    if (!supabaseUser?.email) {
      return {
        success: false,
        error: 'You must be signed in to delete a transaction.',
      }
    }

    // Get user from Prisma
    const user = await prisma.user.findUnique({
      where: {
        email: supabaseUser.email,
      },
    })

    if (!user) {
      return {
        success: false,
        error: 'User not found in database. Please contact support.',
      }
    }

    // Validate input with Zod
    const validationResult = deleteTransactionSchema.safeParse(input)

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {}
      validationResult.error.errors.forEach((error) => {
        const path = error.path.join('.')
        if (!fieldErrors[path]) {
          fieldErrors[path] = []
        }
        fieldErrors[path].push(error.message)
      })

      return {
        success: false,
        error: 'Invalid transaction ID.',
        fieldErrors,
      }
    }

    const validatedData = validationResult.data

    // Get existing transaction
    const existingTransaction = await prisma.transaction.findUnique({
      where: {
        id: validatedData.id,
      },
      include: {
        account: true,
      },
    })

    if (!existingTransaction) {
      return {
        success: false,
        error: 'Transaction not found.',
      }
    }

    if (existingTransaction.userId !== user.id) {
      return {
        success: false,
        error: 'You do not have permission to delete this transaction.',
      }
    }

    // Calculate balance impact to reverse
    const amount = Number(existingTransaction.amount)
    const balanceImpact = calculateBalanceImpact(
      existingTransaction.account.type,
      existingTransaction.type,
      amount
    )

    // Delete transaction and reverse balance impact in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete the transaction
      await tx.transaction.delete({
        where: {
          id: validatedData.id,
        },
      })

      // Reverse the balance impact
      if (balanceImpact !== 0) {
        await tx.account.update({
          where: {
            id: existingTransaction.accountId,
          },
          data: {
            balance: {
              decrement: balanceImpact,
            },
          },
        })
      }
    })

    // Revalidate accounts page
    revalidatePath('/accounts')
    revalidatePath('/(authenticated)/accounts', 'page')

    return {
      success: true,
      message: 'Transaction deleted successfully.',
    }
  } catch (error) {
    console.error('Error deleting transaction:', error)

    return {
      success: false,
      error: 'Failed to delete transaction. Please try again.',
    }
  }
}
