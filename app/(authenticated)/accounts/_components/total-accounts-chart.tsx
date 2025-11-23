'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Account = {
  id: string
  name: string
  type: string
  balance: number
}

type TotalAccountsChartProps = {
  accounts: Account[]
}

export function TotalAccountsChart({ accounts }: TotalAccountsChartProps) {
  // Calculate total assets and debt
  const assets = accounts
    .filter((a) => ['CHECKING', 'SAVINGS', 'INVESTMENT'].includes(a.type))
    .reduce((sum, a) => sum + a.balance, 0)

  const debt = Math.abs(
    accounts
      .filter((a) => ['CREDIT_CARD', 'LOAN'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0)
  )

  // Calculate percentages (mock data for now)
  const assetsChange = 4.89
  const debtChange = 2.78

  // Mock chart data - in a real app, this would be historical data
  const chartData = [
    { date: 'Jan', assets: 42000, debt: 10000 },
    { date: 'Feb', assets: 43500, debt: 10500 },
    { date: 'Mar', assets: 45000, debt: 11000 },
    { date: 'Apr', assets: 46000, debt: 11500 },
    { date: 'May', assets: 47000, debt: 12000 },
    { date: 'Jun', assets: assets, debt: debt },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>Accounts Overview</CardTitle>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Assets</p>
              <p className="text-lg font-bold">
                ${assets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-green-600">↑ {assetsChange}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Debt</p>
              <p className="text-lg font-bold">
                ${debt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-red-600">↓ {debtChange}%</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Assets
                          </span>
                          <span className="font-bold text-emerald-600">
                            ${payload[0].value?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Debt
                          </span>
                          <span className="font-bold text-orange-600">
                            ${payload[1].value?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="assets"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="debt"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
