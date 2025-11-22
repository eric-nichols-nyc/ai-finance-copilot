'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { getExpenseMetricsWithComparison } from '@/lib/expenseUtils'

export async function getDashboardData() {
  const supabase = await createClient()

  // Get the authenticated Supabase user
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser()

  if (!supabaseUser?.email) {
    // Return default metrics if no user found
    return {
      expenseMetrics: {
        totalExpenses: 0,
        interestPaid: 0,
        recurringCharges: 0,
        creditCardSpending: 0,
        loanPayments: 0,
        totalExpensesChange: 0,
        interestPaidChange: 0,
        recurringChargesChange: 0,
        creditCardSpendingChange: 0,
        loanPaymentsChange: 0,
      }
    }
  }

  // Get user from Prisma by email using findUnique
  const user = await prisma.user.findUnique({
    where: {
      email: supabaseUser.email,
    },
  })

  if (!user) {
    // Return default metrics if no user found in database
    return {
      expenseMetrics: {
        totalExpenses: 0,
        interestPaid: 0,
        recurringCharges: 0,
        creditCardSpending: 0,
        loanPayments: 0,
        totalExpensesChange: 0,
        interestPaidChange: 0,
        recurringChargesChange: 0,
        creditCardSpendingChange: 0,
        loanPaymentsChange: 0,
      }
    }
  }

  const expenseMetrics = await getExpenseMetricsWithComparison(user.id)

  return {
    expenseMetrics
  }
}
