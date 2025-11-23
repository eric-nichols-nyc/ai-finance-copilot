'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { deleteAccountSchema, type DeleteAccountInput } from '@/lib/validations/account'

type DeleteAccountSuccess = {
  success: true
  message: string
}

type DeleteAccountError = {
  success: false
  error: string
}

export type DeleteAccountResult = DeleteAccountSuccess | DeleteAccountError

export async function deleteFinancialAccount(
  input: DeleteAccountInput
): Promise<DeleteAccountResult> {
  try {
    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()

    if (!supabaseUser?.email) {
      return {
        success: false,
        error: 'You must be signed in to delete an account.',
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
    const validationResult = deleteAccountSchema.safeParse(input)

    if (!validationResult.success) {
      return {
        success: false,
        error: 'Invalid account ID.',
      }
    }

    const { id } = validationResult.data

    // Verify account exists and belongs to user
    const existingAccount = await prisma.account.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            transactions: true,
            recurring: true,
            interestPayments: true,
          },
        },
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
        error: 'You do not have permission to delete this account.',
      }
    }

    // Delete account (cascading deletes will handle related records)
    await prisma.account.delete({
      where: {
        id,
      },
    })

    // Revalidate accounts page
    revalidatePath('/accounts')
    revalidatePath('/(authenticated)/accounts', 'page')

    const totalDeleted =
      existingAccount._count.transactions +
      existingAccount._count.recurring +
      existingAccount._count.interestPayments

    return {
      success: true,
      message:
        totalDeleted > 0
          ? `Account "${existingAccount.name}" and ${totalDeleted} related records have been deleted.`
          : `Account "${existingAccount.name}" has been deleted.`,
    }
  } catch (error) {
    console.error('Error deleting account:', error)

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return {
          success: false,
          error:
            'Cannot delete account because it has related records. Please delete all transactions first.',
        }
      }
    }

    return {
      success: false,
      error: 'Failed to delete account. Please try again.',
    }
  }
}
