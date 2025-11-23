'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import {
  createTransactionSchema,
  type CreateTransactionInput,
} from '@/lib/validations/transaction'

type CreateTransactionSuccess = {
  success: true
  transaction: {
    id: string
    amount: number
    description: string | null
  }
}

type CreateTransactionError = {
  success: false
  error: string
  fieldErrors?: Record<string, string[]>
}

export type CreateTransactionResult = CreateTransactionSuccess | CreateTransactionError

export async function createTransaction(
  input: CreateTransactionInput
): Promise<CreateTransactionResult> {
  try {
    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()

    if (!supabaseUser?.email) {
      return {
        success: false,
        error: 'You must be signed in to create a transaction.',
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
    const validationResult = createTransactionSchema.safeParse(input)

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

    // Verify account exists and belongs to user
    const account = await prisma.account.findUnique({
      where: {
        id: validatedData.accountId,
      },
    })

    if (!account) {
      return {
        success: false,
        error: 'Account not found.',
      }
    }

    if (account.userId !== user.id) {
      return {
        success: false,
        error: 'You do not have permission to add transactions to this account.',
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

    // Calculate balance impact based on account type and transaction type
    let balanceChange = 0
    const amount = Number(validatedData.amount)

    if (account.type === 'CREDIT_CARD' || account.type === 'LOAN') {
      // For credit cards and loans:
      // - EXPENSE/INTEREST_CHARGE increases balance (you owe more)
      // - INCOME/LOAN_PAYMENT decreases balance (you pay off debt)
      if (
        validatedData.type === 'EXPENSE' ||
        validatedData.type === 'INTEREST_CHARGE'
      ) {
        balanceChange = amount
      } else if (
        validatedData.type === 'INCOME' ||
        validatedData.type === 'LOAN_PAYMENT'
      ) {
        balanceChange = -amount
      }
    } else {
      // For checking and savings:
      // - INCOME increases balance
      // - EXPENSE decreases balance
      if (validatedData.type === 'INCOME') {
        balanceChange = amount
      } else if (validatedData.type === 'EXPENSE') {
        balanceChange = -amount
      }
    }

    // Create transaction and update account balance in a transaction
    const transaction = await prisma.$transaction(async (tx) => {
      // Create the transaction
      const newTransaction = await tx.transaction.create({
        data: {
          amount: validatedData.amount,
          description: validatedData.description,
          date: validatedData.date,
          type: validatedData.type,
          notes: validatedData.notes,
          isRecurring: validatedData.isRecurring,
          accountId: validatedData.accountId,
          categoryId: validatedData.categoryId,
          recurringId: validatedData.recurringId,
          userId: user.id,
        },
      })

      // Update account balance
      await tx.account.update({
        where: {
          id: validatedData.accountId,
        },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      })

      return newTransaction
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
    console.error('Error creating transaction:', error)

    return {
      success: false,
      error: 'Failed to create transaction. Please try again.',
    }
  }
}
