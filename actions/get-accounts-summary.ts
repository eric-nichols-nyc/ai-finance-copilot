'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export type AccountSummary = {
  id: string
  name: string
  type: string
  balance: number
  creditLimit?: number
}

export type AccountsSummary = {
  creditCards: AccountSummary[]
  checking: AccountSummary[]
  savings: AccountSummary[]
  loans: AccountSummary[]
  investments: AccountSummary[]
  all: AccountSummary[]
}

type AccountsSummarySuccess = {
  success: true
  data: AccountsSummary
}

type AccountsSummaryError = {
  success: false
  error: string
}

export type AccountsSummaryResult = AccountsSummarySuccess | AccountsSummaryError

/**
 * Get lightweight account summary for sidebar and layout-level data sharing.
 * Only fetches essential fields (no transactions, no heavy data).
 * Optimized for fast loading and minimal data transfer.
 */
export async function getAccountsSummary(): Promise<AccountsSummaryResult> {
  const supabase = await createClient()

  // Get the authenticated Supabase user
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser()

  if (!supabaseUser?.email) {
    return {
      success: false,
      error: 'No authenticated user found. Please sign in to view your accounts.',
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
      error: 'User not found in database. Please contact support if this issue persists.',
    }
  }

  // Fetch ONLY essential account fields (no transactions, no heavy data)
  const accounts = await prisma.account.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
      type: true,
      balance: true,
      creditLimit: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  // Map accounts to simple summary format
  const accountSummaries: AccountSummary[] = accounts.map((account) => ({
    id: account.id,
    name: account.name,
    type: account.type,
    balance: Number(account.balance),
    creditLimit: account.creditLimit ? Number(account.creditLimit) : undefined,
  }))

  // Group accounts by type for easy access
  const summary: AccountsSummary = {
    creditCards: accountSummaries.filter((a) => a.type === 'CREDIT_CARD'),
    checking: accountSummaries.filter((a) => a.type === 'CHECKING'),
    savings: accountSummaries.filter((a) => a.type === 'SAVINGS'),
    loans: accountSummaries.filter((a) => a.type === 'LOAN'),
    investments: accountSummaries.filter((a) => a.type === 'INVESTMENT'),
    all: accountSummaries,
  }

  return {
    success: true,
    data: summary,
  }
}
