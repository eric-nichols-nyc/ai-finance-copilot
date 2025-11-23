'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { createAccountSchema, type CreateAccountInput } from '@/lib/validations/account'

type CreateAccountSuccess = {
  success: true
  account: {
    id: string
    name: string
    type: string
  }
}

type CreateAccountError = {
  success: false
  error: string
  fieldErrors?: Record<string, string[]>
}

export type CreateAccountResult = CreateAccountSuccess | CreateAccountError

export async function createAccount(
  input: CreateAccountInput
): Promise<CreateAccountResult> {
  try {
    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()

    if (!supabaseUser?.email) {
      return {
        success: false,
        error: 'You must be signed in to create an account.',
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
    const validationResult = createAccountSchema.safeParse(input)

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

    // Prepare account data based on type
    const accountData: any = {
      name: validatedData.name,
      type: validatedData.type,
      balance: validatedData.balance,
      currency: validatedData.currency || 'USD',
      userId: user.id,
    }

    // Add type-specific fields
    if (validatedData.type === 'CREDIT_CARD') {
      accountData.creditLimit = validatedData.creditLimit
      accountData.apr = validatedData.apr
    } else if (validatedData.type === 'LOAN') {
      accountData.loanAmount = validatedData.loanAmount
      accountData.remainingBalance = validatedData.remainingBalance
      accountData.loanTerm = validatedData.loanTerm
      accountData.monthlyPayment = validatedData.monthlyPayment
      if (validatedData.apr !== undefined) {
        accountData.apr = validatedData.apr
      }
    }

    // Create account in database
    const account = await prisma.account.create({
      data: accountData,
    })

    // Revalidate accounts page
    revalidatePath('/accounts')
    revalidatePath('/(authenticated)/accounts', 'page')

    return {
      success: true,
      account: {
        id: account.id,
        name: account.name,
        type: account.type,
      },
    }
  } catch (error) {
    console.error('Error creating account:', error)

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
      error: 'Failed to create account. Please try again.',
    }
  }
}
