'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type Recurring = {
  id: string
  name: string
  amount: number
  frequency: string
  nextDueDate: Date
}

type TotalRecurringsChartProps = {
  recurrings: Recurring[]
}

export function TotalRecurringsChart({ recurrings }: TotalRecurringsChartProps) {
  const now = new Date()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Calculate left to pay (recurrings due this month that haven't been paid)
  const leftToPay = recurrings
    .filter((r) => {
      const dueDate = new Date(r.nextDueDate)
      return dueDate <= endOfMonth && dueDate >= now
    })
    .reduce((sum, r) => sum + r.amount, 0)

  // Calculate paid so far (total amount of all past recurrings this year)
  // For now, estimate based on frequency
  const paidSoFar = recurrings.reduce((sum, r) => {
    const monthsPassed = now.getMonth() + 1
    let paymentsMade = 0

    switch (r.frequency.toLowerCase()) {
      case 'monthly':
        paymentsMade = monthsPassed
        break
      case 'weekly':
        paymentsMade = monthsPassed * 4
        break
      case 'biweekly':
        paymentsMade = monthsPassed * 2
        break
      case 'quarterly':
        paymentsMade = Math.floor(monthsPassed / 3)
        break
      case 'yearly':
        paymentsMade = monthsPassed >= 12 ? 1 : 0
        break
      default:
        paymentsMade = monthsPassed
    }

    return sum + r.amount * paymentsMade
  }, 0)

  const total = leftToPay + paidSoFar
  const paidPercentage = total > 0 ? (paidSoFar / total) * 100 : 0

  // Chart data for donut chart
  const chartData = [
    { name: 'Paid', value: paidSoFar, color: '#3b82f6' },
    { name: 'Remaining', value: leftToPay, color: '#1e293b' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurrings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-8">
          {/* Left to pay */}
          <div className="flex flex-col items-start">
            <p className="text-2xl font-bold">
              ${leftToPay.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-muted-foreground">left to pay</p>
          </div>

          {/* Donut Chart */}
          <div className="relative h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={0}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Paid so far */}
          <div className="flex flex-col items-end">
            <p className="text-2xl font-bold">
              ${paidSoFar.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-muted-foreground">paid so far</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
