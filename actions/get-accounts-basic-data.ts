'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export type AccountBasicData = {
  id: string
  name: string
  type: string
  balance: number
  creditLimit?: number
  apr?: number
  loanAmount?: number
  remainingBalance?: number
  loanTerm?: number
  monthlyPayment?: number
  createdAt: Date
  updatedAt: Date
}

type AccountsBasicDataSuccess = {
  success: true
  accounts: AccountBasicData[]
}

type AccountsBasicDataError = {
  success: false
  error: string
}

export type AccountsBasicDataResult =
  | AccountsBasicDataSuccess
  | AccountsBasicDataError

/**
 * Get account data WITHOUT transactions for faster initial page load.
 * Transactions should be loaded separately when needed.
 */
export async function getAccountsBasicData(): Promise<AccountsBasicDataResult> {
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
      error:
        'User not found in database. Please contact support if this issue persists.',
    }
  }

  // Get all accounts WITHOUT transactions
  const accounts = await prisma.account.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return {
    success: true,
    accounts: accounts.map((account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: Number(account.balance),
      creditLimit: account.creditLimit ? Number(account.creditLimit) : undefined,
      apr: account.apr ? Number(account.apr) : undefined,
      loanAmount: account.loanAmount ? Number(account.loanAmount) : undefined,
      remainingBalance: account.remainingBalance
        ? Number(account.remainingBalance)
        : undefined,
      loanTerm: account.loanTerm ?? undefined,
      monthlyPayment: account.monthlyPayment
        ? Number(account.monthlyPayment)
        : undefined,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    })),
  }
}
