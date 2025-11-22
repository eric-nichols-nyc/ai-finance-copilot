'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { getExpenseMetricsWithComparison } from '@/lib/expenseUtils'

type DashboardDataSuccess = {
  success: true
  expenseMetrics: {
    totalExpenses: number
    interestPaid: number
    recurringCharges: number
    creditCardSpending: number
    loanPayments: number
    totalExpensesChange: number
    interestPaidChange: number
    recurringChargesChange: number
    creditCardSpendingChange: number
    loanPaymentsChange: number
  }
}

type DashboardDataError = {
  success: false
  error: string
}

export type DashboardDataResult = DashboardDataSuccess | DashboardDataError

export async function getDashboardData(): Promise<DashboardDataResult> {
  const supabase = await createClient()

  // Get the authenticated Supabase user
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser()

  if (!supabaseUser?.email) {
    return {
      success: false,
      error: 'No authenticated user found. Please sign in to view your dashboard.',
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

  const expenseMetrics = await getExpenseMetricsWithComparison(user.id)

  return {
    success: true,
    expenseMetrics
  }
}
