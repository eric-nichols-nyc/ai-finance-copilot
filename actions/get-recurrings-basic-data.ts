'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export type RecurringBasicData = {
  id: string
  name: string
  amount: number
  frequency: string
  nextDueDate: Date
  accountId: string
  categoryId: string
  createdAt: Date
  updatedAt: Date
  account: {
    id: string
    name: string
    type: string
  }
  category: {
    id: string
    name: string
    type: string
  }
}

type RecurringsBasicDataSuccess = {
  success: true
  recurrings: RecurringBasicData[]
}

type RecurringsBasicDataError = {
  success: false
  error: string
}

export type RecurringsBasicDataResult =
  | RecurringsBasicDataSuccess
  | RecurringsBasicDataError

/**
 * Get recurring charges data WITHOUT transactions for faster initial page load.
 * Transactions should be loaded separately when needed.
 */
export async function getRecurringsBasicData(): Promise<RecurringsBasicDataResult> {
  const supabase = await createClient()

  // Get the authenticated Supabase user
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser()

  if (!supabaseUser?.email) {
    return {
      success: false,
      error: 'No authenticated user found. Please sign in to view your recurring charges.',
    }
  }

  // Get user from Prisma by email
  const user = await prisma.user.findUnique({
    where: {
      email: supabaseUser.email,
    },
  })

  if (!user) {
    return {
      success: false,
      error:
        'User not found in database. Please contact support if this issue persists.',
    }
  }

  // Get all recurring charges WITHOUT transactions
  const recurrings = await prisma.recurringCharge.findMany({
    where: {
      userId: user.id,
    },
    include: {
      account: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
    orderBy: {
      nextDueDate: 'asc',
    },
  })

  return {
    success: true,
    recurrings: recurrings.map((recurring) => ({
      id: recurring.id,
      name: recurring.name,
      amount: Number(recurring.amount),
      frequency: recurring.frequency,
      nextDueDate: recurring.nextDueDate,
      accountId: recurring.accountId,
      categoryId: recurring.categoryId,
      createdAt: recurring.createdAt,
      updatedAt: recurring.updatedAt,
      account: recurring.account,
      category: recurring.category,
    })),
  }
}
