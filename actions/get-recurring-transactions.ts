'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export type RecurringTransaction = {
  id: string
  amount: number
  description: string | null
  date: Date
  type: string
  categoryId: string
  category?: {
    id: string
    name: string
    type: string
  }
}

type RecurringTransactionsSuccess = {
  success: true
  transactions: RecurringTransaction[]
  total: number
}

type RecurringTransactionsError = {
  success: false
  error: string
}

export type RecurringTransactionsResult =
  | RecurringTransactionsSuccess
  | RecurringTransactionsError

export type GetRecurringTransactionsOptions = {
  limit?: number
  offset?: number
  includeCategory?: boolean
}

/**
 * Get transactions for a specific recurring charge.
 * This is loaded lazily when the user selects a recurring charge.
 */
export async function getRecurringTransactions(
  recurringId: string,
  options: GetRecurringTransactionsOptions = {}
): Promise<RecurringTransactionsResult> {
  const { limit = 100, offset = 0, includeCategory = true } = options

  const supabase = await createClient()

  // Get the authenticated Supabase user
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser()

  if (!supabaseUser?.email) {
    return {
      success: false,
      error: 'No authenticated user found. Please sign in to view transactions.',
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

  // Verify recurring charge belongs to user
  const recurring = await prisma.recurringCharge.findFirst({
    where: {
      id: recurringId,
      userId: user.id,
    },
  })

  if (!recurring) {
    return {
      success: false,
      error: 'Recurring charge not found or you do not have access to it.',
    }
  }

  // Get transactions for this recurring charge
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        recurringChargeId: recurringId,
      },
      include: includeCategory
        ? {
            category: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          }
        : undefined,
      orderBy: {
        date: 'desc',
      },
      take: limit,
      skip: offset,
    }),
    prisma.transaction.count({
      where: {
        recurringChargeId: recurringId,
      },
    }),
  ])

  return {
    success: true,
    transactions: transactions.map((transaction) => ({
      id: transaction.id,
      amount: Number(transaction.amount),
      description: transaction.description,
      date: transaction.date,
      type: transaction.type,
      categoryId: transaction.categoryId,
      category: transaction.category,
    })),
    total,
  }
}
