import { MonthlySpendingCard } from "./_components/monthly-spending-card"
import { AssetDebtCard } from "./_components/asset-debt-card"
import { TransactionsToReviewCard } from "./_components/transactions-to-review-card"
import { TopCategoriesCard } from "./_components/top-categories-card"
import { NetThisMonthCard } from "./_components/net-this-month-card"
import { NextTwoWeeksCard } from "./_components/next-two-weeks-card"
import { GoalsCard } from "./_components/goals-card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* First Row: Monthly Spending & Assets/Debt */}
      <div className="grid gap-6 md:grid-cols-3">
        <MonthlySpendingCard />
        <AssetDebtCard />
      </div>

      {/* Second Row: Transactions to Review & Top Categories */}
      <div className="grid gap-6 md:grid-cols-3">
        <TransactionsToReviewCard />
        <TopCategoriesCard />
      </div>

      {/* Third Row: Net This Month, Next Two Weeks, Goals */}
      <div className="grid gap-6 md:grid-cols-3">
        <NetThisMonthCard />
        <NextTwoWeeksCard />
        <GoalsCard />
      </div>
    </div>
  )
}
