'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import {
  updateTransactionSchema,
  type UpdateTransactionInput,
} from '@/lib/validations/transaction'

type UpdateTransactionSuccess = {
  success: true
  transaction: {
    id: string
    amount: number
    description: string | null
  }
}

type UpdateTransactionError = {
  success: false
  error: string
  fieldErrors?: Record<string, string[]>
}

export type UpdateTransactionResult = UpdateTransactionSuccess | UpdateTransactionError

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

export async function updateTransaction(
  input: UpdateTransactionInput
): Promise<UpdateTransactionResult> {
  try {
    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()

    if (!supabaseUser?.email) {
      return {
        success: false,
        error: 'You must be signed in to update a transaction.',
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
    const validationResult = updateTransactionSchema.safeParse(input)

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
        error: 'Invalid transaction data. Please check your inputs.',
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
        error: 'You do not have permission to update this transaction.',
      }
    }

    // Verify category exists if provided
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: validatedData.categoryId,
        },
      })

      if (!category) {
        return {
          success: false,
          error: 'Category not found.',
        }
      }

      if (category.userId !== user.id) {
        return {
          success: false,
          error: 'You do not have permission to use this category.',
        }
      }
    }

    // Calculate old balance impact
    const oldAmount = Number(existingTransaction.amount)
    const oldType = existingTransaction.type
    const oldBalanceImpact = calculateBalanceImpact(
      existingTransaction.account.type,
      oldType,
      oldAmount
    )

    // Calculate new balance impact
    const newAmount = validatedData.amount !== undefined
      ? Number(validatedData.amount)
      : oldAmount
    const newType = validatedData.type || oldType
    const newBalanceImpact = calculateBalanceImpact(
      existingTransaction.account.type,
      newType,
      newAmount
    )

    // Calculate net balance change (remove old impact, add new impact)
    const balanceChange = newBalanceImpact - oldBalanceImpact

    // Prepare update data
    const updateData: any = {}
    if (validatedData.amount !== undefined) {
      updateData.amount = validatedData.amount
    }
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description
    }
    if (validatedData.date !== undefined) {
      updateData.date = validatedData.date
    }
    if (validatedData.type !== undefined) {
      updateData.type = validatedData.type
    }
    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes
    }
    if (validatedData.isRecurring !== undefined) {
      updateData.isRecurring = validatedData.isRecurring
    }
    if (validatedData.categoryId !== undefined) {
      updateData.categoryId = validatedData.categoryId
    }
    if (validatedData.recurringId !== undefined) {
      updateData.recurringId = validatedData.recurringId
    }

    // Update transaction and adjust account balance in a transaction
    const transaction = await prisma.$transaction(async (tx) => {
      // Update the transaction
      const updatedTransaction = await tx.transaction.update({
        where: {
          id: validatedData.id,
        },
        data: updateData,
      })

      // Update account balance if there's a change
      if (balanceChange !== 0) {
        await tx.account.update({
          where: {
            id: existingTransaction.accountId,
          },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        })
      }

      return updatedTransaction
    })

    // Revalidate all pages that depend on transaction data
    revalidatePath('/accounts')
    revalidatePath('/(authenticated)/accounts', 'page')
    revalidatePath('/dashboard')
    revalidatePath('/(authenticated)/dashboard', 'page')
    revalidatePath('/transactions')
    revalidatePath('/(authenticated)/transactions', 'page')
    // Also revalidate layout to update sidebar
    revalidatePath('/(authenticated)', 'layout')

    return {
      success: true,
      transaction: {
        id: transaction.id,
        amount: Number(transaction.amount),
        description: transaction.description,
      },
    }
  } catch (error) {
    console.error('Error updating transaction:', error)

    return {
      success: false,
      error: 'Failed to update transaction. Please try again.',
    }
  }
}
