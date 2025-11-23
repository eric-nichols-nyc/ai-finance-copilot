'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { updateAccountSchema, type UpdateAccountInput } from '@/lib/validations/account'

type UpdateAccountSuccess = {
  success: true
  account: {
    id: string
    name: string
    type: string
  }
}

type UpdateAccountError = {
  success: false
  error: string
  fieldErrors?: Record<string, string[]>
}

export type UpdateAccountResult = UpdateAccountSuccess | UpdateAccountError

export async function updateAccount(
  input: UpdateAccountInput
): Promise<UpdateAccountResult> {
  try {
    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()

    if (!supabaseUser?.email) {
      return {
        success: false,
        error: 'You must be signed in to update an account.',
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
    const validationResult = updateAccountSchema.safeParse(input)

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
        error: 'Invalid account data. Please check your inputs.',
        fieldErrors,
      }
    }

    const validatedData = validationResult.data

    // Verify account exists and belongs to user
    const existingAccount = await prisma.account.findUnique({
      where: {
        id: validatedData.id,
      },
    })

    if (!existingAccount) {
      return {
        success: false,
        error: 'Account not found.',
      }
    }

    if (existingAccount.userId !== user.id) {
      return {
        success: false,
        error: 'You do not have permission to update this account.',
      }
    }

    // Prepare update data
    const updateData: any = {}

    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name
    }
    if (validatedData.balance !== undefined) {
      updateData.balance = validatedData.balance
    }
    if (validatedData.currency !== undefined) {
      updateData.currency = validatedData.currency
    }

    // Add type-specific fields
    if (validatedData.type === 'CREDIT_CARD') {
      if (validatedData.creditLimit !== undefined) {
        updateData.creditLimit = validatedData.creditLimit
      }
      if (validatedData.apr !== undefined) {
        updateData.apr = validatedData.apr
      }
    } else if (validatedData.type === 'LOAN') {
      if (validatedData.loanAmount !== undefined) {
        updateData.loanAmount = validatedData.loanAmount
      }
      if (validatedData.remainingBalance !== undefined) {
        updateData.remainingBalance = validatedData.remainingBalance
      }
      if (validatedData.loanTerm !== undefined) {
        updateData.loanTerm = validatedData.loanTerm
      }
      if (validatedData.monthlyPayment !== undefined) {
        updateData.monthlyPayment = validatedData.monthlyPayment
      }
      if (validatedData.apr !== undefined) {
        updateData.apr = validatedData.apr
      }
    }

    // Update account in database
    const account = await prisma.account.update({
      where: {
        id: validatedData.id,
      },
      data: updateData,
    })

    // Revalidate all pages that depend on account data
    revalidatePath('/accounts')
    revalidatePath('/(authenticated)/accounts', 'page')
    revalidatePath('/dashboard')
    revalidatePath('/(authenticated)/dashboard', 'page')
    // Also revalidate layout to update sidebar
    revalidatePath('/(authenticated)', 'layout')

    return {
      success: true,
      account: {
        id: account.id,
        name: account.name,
        type: account.type,
      },
    }
  } catch (error) {
    console.error('Error updating account:', error)

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          error: 'An account with this name already exists.',
        }
      }
    }

    return {
      success: false,
      error: 'Failed to update account. Please try again.',
    }
  }
}
