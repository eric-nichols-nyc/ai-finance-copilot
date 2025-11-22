import { MonthlySpendingCard } from "./_components/MonthlySpendingCard"
import { AssetsDebtCard } from "./_components/AssetsDebtCard"
import { TransactionsToReviewCard } from "./_components/TransactionsToReviewCard"
import { TopCategoriesCard } from "./_components/TopCategoriesCard"
import { NetThisMonthCard } from "./_components/NetThisMonthCard"
import { NextTwoWeeksCard } from "./_components/NextTwoWeeksCard"
import { GoalsCard } from "./_components/GoalsCard"

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
        <AssetsDebtCard />
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
