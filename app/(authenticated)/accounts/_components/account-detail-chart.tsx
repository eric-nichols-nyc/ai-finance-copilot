'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Circle } from 'lucide-react'
import { getAccountBalanceHistory, type TimePeriod } from '@/actions/get-account-balance-history'
import { type Account } from '@/types'

type AccountDetailChartProps = {
  account: Account | null
}

export function AccountDetailChart({ account }: AccountDetailChartProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('1M')
  const [chartData, setChartData] = useState<Array<{ date: string; balance: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch balance history when account or time period changes
  useEffect(() => {
    if (!account) {
      setLoading(false)
      return
    }

    async function loadBalanceHistory() {
      setLoading(true)
      setError(null)

      const result = await getAccountBalanceHistory(account!.id, timePeriod)

      if (result.success) {
        setChartData(result.data)
      } else {
        setError(result.error)
        // Fallback to showing current balance as single data point
        setChartData([
          {
            date: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            balance: account!.balance,
          },
        ])
      }

      setLoading(false)
    }

    loadBalanceHistory()
  }, [account!.id, timePeriod])

  if (!account) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">Select an account to view details</p>
        </CardContent>
      </Card>
    )
  }

  const utilizationPercentage = account.creditLimit
    ? ((Math.abs(account.balance) / account.creditLimit) * 100).toFixed(2)
    : null

  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Circle className="h-4 w-4 fill-green-500 text-green-500" />
            <span>{account.id.slice(-4)}</span>
            <span className="text-muted-foreground/60">Last updated 10 hours ago</span>
          </div>
          {utilizationPercentage && (
            <div
              className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                parseFloat(utilizationPercentage) > 70
                  ? 'bg-red-100 text-red-800'
                  : parseFloat(utilizationPercentage) > 50
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {utilizationPercentage}%
            </div>
          )}
        </div>
        <div className="flex items-start justify-between">
          <div className="flex flex-row items-center gap-6">
            <CardTitle className="text-2xl">{account.name}</CardTitle>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-3xl font-bold">
                  $
                  {Math.abs(account.balance).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              {account.creditLimit && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    / ${account.creditLimit.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Loading balance history...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No balance history available yet</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No data available for this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Balance
                          </span>
                          <span className="font-bold">
                            ${payload[0].value?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#colorBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        <div className="mt-6 flex justify-center">
          <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
            <TabsList>
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="3M">3M</TabsTrigger>
              <TabsTrigger value="YTD">YTD</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
              <TabsTrigger value="ALL">ALL</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
