import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { ExpenseMetricsComparison } from "@/lib/types"

interface MonthlySpendingCardProps {
  metrics: ExpenseMetricsComparison
}

interface MetricColumnProps {
  title: string
  value: number
  changePercent: number
}

function MetricColumn({ title, value, changePercent }: MetricColumnProps) {
  const isPositive = changePercent > 0
  const isNegative = changePercent < 0

  // For expenses, increases are bad (red), decreases are good (green)
  const colorClass = isPositive
    ? 'text-red-600'
    : isNegative
    ? 'text-green-600'
    : 'text-zinc-600'

  return (
    <div className="flex flex-col space-y-2 p-4 rounded-lg bg-white border border-zinc-200">
      <div className="text-xs font-medium text-zinc-600 uppercase tracking-wider">
        {title}
      </div>
      <div className="text-2xl font-bold text-zinc-900">
        {formatCurrency(value)}
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${colorClass}`}>
        {isPositive && <ArrowUpIcon className="h-4 w-4" />}
        {isNegative && <ArrowDownIcon className="h-4 w-4" />}
        {!isPositive && !isNegative && <TrendingUpIcon className="h-4 w-4 text-zinc-400" />}
        <span>
          {Math.abs(changePercent).toFixed(1)}%
        </span>
        <span className="text-xs text-zinc-500">vs last month</span>
      </div>
    </div>
  )
}

export function MonthlySpendingCard({ metrics }: MonthlySpendingCardProps) {
  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Monthly Expense Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your expenses across different categories with month-over-month trends
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricColumn
            title="Total Expenses"
            value={metrics.totalExpenses}
            changePercent={metrics.totalExpensesChange}
          />
          <MetricColumn
            title="Interest Paid"
            value={metrics.interestPaid}
            changePercent={metrics.interestPaidChange}
          />
          <MetricColumn
            title="Recurring Charges"
            value={metrics.recurringCharges}
            changePercent={metrics.recurringChargesChange}
          />
          <MetricColumn
            title="Credit Card Spending"
            value={metrics.creditCardSpending}
            changePercent={metrics.creditCardSpendingChange}
          />
          <MetricColumn
            title="Loan Payments"
            value={metrics.loanPayments}
            changePercent={metrics.loanPaymentsChange}
          />
        </div>
      </CardContent>
    </Card>
  )
}
