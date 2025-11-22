import { prisma } from '@/lib/prisma'
import { AccountType, TransactionType, ExpenseMetrics, ExpenseMetricsComparison } from '@/lib/types'

/**
 * Get the start and end dates for a given month
 */
export function getMonthDateRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
  return { start, end }
}

/**
 * Get the previous month's date
 */
export function getPreviousMonth(date: Date): Date {
  const prevMonth = new Date(date)
  prevMonth.setMonth(prevMonth.getMonth() - 1)
  return prevMonth
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  return ((current - previous) / previous) * 100
}

/**
 * Get expense metrics for a specific month
 */
export async function getMonthlyExpenseMetrics(
  userId: string,
  monthDate: Date
): Promise<ExpenseMetrics> {
  const { start, end } = getMonthDateRange(monthDate)

  // Get all transactions for the month
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: start,
        lte: end,
      },
    },
    include: {
      account: true,
    },
  })

  // Calculate total expenses
  const totalExpenses = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // Calculate interest paid (from INTEREST_CHARGE transactions)
  // Note: InterestPayment table support will be added after Prisma client regeneration
  const interestFromTransactions = transactions
    .filter((t) => t.type === TransactionType.INTEREST_CHARGE)
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // TODO: Re-enable after Prisma client is regenerated with InterestPayment model
  // const interestPayments = await prisma.interestPayment.findMany({
  //   where: {
  //     userId,
  //     date: {
  //       gte: start,
  //       lte: end,
  //     },
  //   },
  // })
  // const interestFromPayments = interestPayments.reduce((sum, ip) => sum + Number(ip.amount), 0)

  const interestPaid = interestFromTransactions

  // Calculate recurring charges
  const recurringTransactions = transactions.filter(
    (t) => t.isRecurring && t.type === TransactionType.EXPENSE
  )
  const recurringCharges = recurringTransactions.reduce((sum, t) => sum + Number(t.amount), 0)

  // Calculate credit card spending (excluding interest charges)
  const creditCardSpending = transactions
    .filter(
      (t) =>
        t.type === TransactionType.EXPENSE &&
        t.account.type === AccountType.CREDIT_CARD
        // Interest charges are already counted in interestPaid
    )
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // Calculate loan payments
  const loanPayments = transactions
    .filter(
      (t) =>
        (t.type === TransactionType.LOAN_PAYMENT ||
         (t.type === TransactionType.EXPENSE && t.account.type === AccountType.LOAN))
    )
    .reduce((sum, t) => sum + Number(t.amount), 0)

  return {
    totalExpenses,
    interestPaid,
    recurringCharges,
    creditCardSpending,
    loanPayments,
  }
}

/**
 * Get expense metrics with month-over-month comparison
 */
export async function getExpenseMetricsWithComparison(
  userId: string,
  currentMonth: Date = new Date()
): Promise<ExpenseMetricsComparison> {
  const currentMetrics = await getMonthlyExpenseMetrics(userId, currentMonth)
  const previousMonth = getPreviousMonth(currentMonth)
  const previousMetrics = await getMonthlyExpenseMetrics(userId, previousMonth)

  return {
    ...currentMetrics,
    totalExpensesChange: calculatePercentageChange(
      currentMetrics.totalExpenses,
      previousMetrics.totalExpenses
    ),
    interestPaidChange: calculatePercentageChange(
      currentMetrics.interestPaid,
      previousMetrics.interestPaid
    ),
    recurringChargesChange: calculatePercentageChange(
      currentMetrics.recurringCharges,
      previousMetrics.recurringCharges
    ),
    creditCardSpendingChange: calculatePercentageChange(
      currentMetrics.creditCardSpending,
      previousMetrics.creditCardSpending
    ),
    loanPaymentsChange: calculatePercentageChange(
      currentMetrics.loanPayments,
      previousMetrics.loanPayments
    ),
  }
}
