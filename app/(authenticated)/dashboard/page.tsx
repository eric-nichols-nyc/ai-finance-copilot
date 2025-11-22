import { MonthlySpendingCard } from "./_components/MonthlySpendingCard"
import { AssetsDebtCard } from "./_components/AssetsDebtCard"
import { TransactionsToReviewCard } from "./_components/TransactionsToReviewCard"
import { TopCategoriesCard } from "./_components/TopCategoriesCard"
import { NetThisMonthCard } from "./_components/NetThisMonthCard"
import { NextTwoWeeksCard } from "./_components/NextTwoWeeksCard"
import { GoalsCard } from "./_components/GoalsCard"
import { getExpenseMetricsWithComparison } from "@/lib/expenseUtils"
import { prisma } from "@/lib/prisma"

async function getDashboardData() {
  // Get the first user (demo user)
  const user = await prisma.user.findFirst()
  if (!user) {
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

  const expenseMetrics = await getExpenseMetricsWithComparison(user.id)

  return {
    expenseMetrics
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* First Row: Monthly Spending */}
      <div className="grid gap-6">
        <MonthlySpendingCard metrics={data.expenseMetrics} />
      </div>

      {/* Second Row: Assets/Debt */}
      <div className="grid gap-6 md:grid-cols-3">
        <AssetsDebtCard />
      </div>

      {/* Third Row: Transactions to Review & Top Categories */}
      <div className="grid gap-6 md:grid-cols-3">
        <TransactionsToReviewCard />
        <TopCategoriesCard />
      </div>

      {/* Fourth Row: Net This Month, Next Two Weeks, Goals */}
      <div className="grid gap-6 md:grid-cols-3">
        <NetThisMonthCard />
        <NextTwoWeeksCard />
        <GoalsCard />
      </div>
    </div>
  )
}
