'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

type AccountWithTransactions = {
  id: string
  name: string
  type: string
  balance: number
  creditLimit?: number
  apr?: number
  transactions: Array<{
    id: string
    amount: number
    description: string | null
    date: Date
    type: string
  }>
}

type AccountsDataSuccess = {
  success: true
  accounts: AccountWithTransactions[]
}

type AccountsDataError = {
  success: false
  error: string
}

export type AccountsDataResult = AccountsDataSuccess | AccountsDataError

export async function getAccountsData(): Promise<AccountsDataResult> {
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

  // Get user from Prisma by email using findUnique
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

  // Get all accounts with their transactions
  const accounts = await prisma.account.findMany({
    where: {
      userId: user.id,
    },
    include: {
      transactions: {
        orderBy: {
          date: 'desc',
        },
        take: 100, // Get last 100 transactions for charting
      },
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
      transactions: account.transactions.map((t) => ({
        id: t.id,
        amount: Number(t.amount),
        description: t.description,
        date: t.date,
        type: t.type,
      })),
    })),
  }
}
