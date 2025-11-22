'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { getExpenseMetricsWithComparison, getMonthDateRange, getPreviousMonth } from '@/lib/expenseUtils'

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
  accounts: Array<{
    id: string
    name: string
    type: string
    balance: number
    creditLimit?: number
  }>
  unreviewedTransactions: Array<{
    id: string
    amount: number
    description: string | null
    date: Date
    type: string
    account: {
      name: string
    }
    category: {
      name: string
      color: string | null
    } | null
  }>
  topCategories: Array<{
    name: string
    spent: number
    budget: number | null
    color: string | null
  }>
  monthlyIncome: number
  monthlyExpenses: number
  previousMonthIncome: number
  previousMonthExpenses: number
  upcomingRecurring: Array<{
    id: string
    name: string
    amount: number
    frequency: string
    nextDueDate: Date
    account: {
      name: string
    }
    category: {
      name: string
    }
  }>
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

  // Get current and previous month date ranges
  const currentMonth = new Date()
  const { start: currentMonthStart, end: currentMonthEnd } = getMonthDateRange(currentMonth)
  const previousMonth = getPreviousMonth(currentMonth)
  const { start: previousMonthStart, end: previousMonthEnd } = getMonthDateRange(previousMonth)

  // Get expense metrics
  const expenseMetrics = await getExpenseMetricsWithComparison(user.id)

  // Get all accounts for assets/debt calculation
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
  })

  // Get unreviewed transactions (recent transactions without categories)
  const unreviewedTransactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      categoryId: null,
      type: 'EXPENSE',
    },
    include: {
      account: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
          color: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
    take: 10,
  })

  // Get current month transactions for category analysis
  const currentMonthTransactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
    include: {
      category: {
        select: {
          name: true,
          color: true,
        },
      },
    },
  })

  // Calculate income and expenses for current month
  const monthlyIncome = currentMonthTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthlyExpenses = currentMonthTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // Calculate income and expenses for previous month
  const previousMonthTransactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  })

  const previousMonthIncome = previousMonthTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const previousMonthExpenses = previousMonthTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // Calculate spending by category for current month
  const categorySpending = currentMonthTransactions
    .filter((t) => t.type === 'EXPENSE' && t.category)
    .reduce((acc, t) => {
      const categoryName = t.category!.name
      const categoryColor = t.category!.color
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          spent: 0,
          color: categoryColor,
        }
      }
      acc[categoryName].spent += Number(t.amount)
      return acc
    }, {} as Record<string, { name: string; spent: number; color: string | null }>)

  // Get budgets for categories
  const budgets = await prisma.budget.findMany({
    where: {
      userId: user.id,
      startDate: {
        lte: currentMonthEnd,
      },
      OR: [
        { endDate: null },
        { endDate: { gte: currentMonthStart } },
      ],
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  })

  // Combine spending with budgets
  const topCategories = Object.values(categorySpending)
    .map((cat) => {
      const budget = budgets.find((b) => b.category?.name === cat.name)
      return {
        ...cat,
        budget: budget ? Number(budget.amount) : null,
      }
    })
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 6)

  // Get upcoming recurring charges (next 2 weeks)
  const twoWeeksFromNow = new Date()
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)

  const upcomingRecurring = await prisma.recurringCharge.findMany({
    where: {
      userId: user.id,
      nextDueDate: {
        gte: new Date(),
        lte: twoWeeksFromNow,
      },
    },
    include: {
      account: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      nextDueDate: 'asc',
    },
    take: 10,
  })

  return {
    success: true,
    expenseMetrics,
    accounts: accounts.map((a) => ({
      ...a,
      balance: Number(a.balance),
      creditLimit: a.creditLimit ? Number(a.creditLimit) : undefined,
    })),
    unreviewedTransactions: unreviewedTransactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    })),
    topCategories,
    monthlyIncome,
    monthlyExpenses,
    previousMonthIncome,
    previousMonthExpenses,
    upcomingRecurring: upcomingRecurring.map((r) => ({
      ...r,
      amount: Number(r.amount),
    })),
  }
}
