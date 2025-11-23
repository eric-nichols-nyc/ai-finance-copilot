'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export type TransactionData = {
  id: string
  amount: number
  description: string | null
  date: Date
  type: string
  categoryId: string | null
  category?: {
    id: string
    name: string
    color: string | null
    icon: string | null
  } | null
}

type AccountTransactionsSuccess = {
  success: true
  transactions: TransactionData[]
  hasMore: boolean
  total: number
}

type AccountTransactionsError = {
  success: false
  error: string
}

export type AccountTransactionsResult =
  | AccountTransactionsSuccess
  | AccountTransactionsError

export type GetAccountTransactionsOptions = {
  limit?: number
  offset?: number
  includeCategory?: boolean
}

/**
 * Get paginated transactions for a specific account.
 * Supports lazy loading and infinite scroll patterns.
 */
export async function getAccountTransactions(
  accountId: string,
  options: GetAccountTransactionsOptions = {}
): Promise<AccountTransactionsResult> {
  const { limit = 20, offset = 0, includeCategory = true } = options

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

  // Verify the account belongs to the user
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId: user.id,
    },
  })

  if (!account) {
    return {
      success: false,
      error: 'Account not found or you do not have permission to view it.',
    }
  }

  // Get total count for pagination
  const total = await prisma.transaction.count({
    where: {
      accountId,
    },
  })

  // Get paginated transactions
  const transactions = await prisma.transaction.findMany({
    where: {
      accountId,
    },
    include: includeCategory
      ? {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
            },
          },
        }
      : undefined,
    orderBy: {
      date: 'desc',
    },
    skip: offset,
    take: limit,
  })

  const hasMore = offset + transactions.length < total

  return {
    success: true,
    transactions: transactions.map((t) => ({
      id: t.id,
      amount: Number(t.amount),
      description: t.description,
      date: t.date,
      type: t.type,
      categoryId: t.categoryId,
      category: t.category
        ? {
            id: t.category.id,
            name: t.category.name,
            color: t.category.color,
            icon: t.category.icon,
          }
        : null,
    })),
    hasMore,
    total,
  }
}
