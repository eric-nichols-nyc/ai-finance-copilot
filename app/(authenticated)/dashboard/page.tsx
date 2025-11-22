import { MonthlySpendingCard } from "./_components/MonthlySpendingCard"
import { AssetsDebtCard } from "./_components/AssetsDebtCard"
import { TransactionsToReviewCard } from "./_components/TransactionsToReviewCard"
import { TopCategoriesCard } from "./_components/TopCategoriesCard"
import { NetThisMonthCard } from "./_components/NetThisMonthCard"
import { NextTwoWeeksCard } from "./_components/NextTwoWeeksCard"
import { GoalsCard } from "./_components/GoalsCard"
import { DashboardDebugger } from "./_components/DashboardDebugger"
import { getDashboardData } from "@/actions/get-dashboard-data"

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

      {/* Debug Component (Development Only) */}
      <DashboardDebugger data={data} />
    </div>
  )
}
