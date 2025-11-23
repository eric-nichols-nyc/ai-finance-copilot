'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Account = {
  id: string
  name: string
  type: string
  balance: number
  creditLimit?: number
}

type AccountDetailChartProps = {
  account: Account | null
}

export function AccountDetailChart({ account }: AccountDetailChartProps) {
  const [timePeriod, setTimePeriod] = useState('1M')

  if (!account) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">Select an account to view details</p>
        </CardContent>
      </Card>
    )
  }

  // Mock chart data - in a real app, this would be based on selected time period
  const chartData = [
    { date: 'Oct 1', balance: 6500 },
    { date: 'Oct 5', balance: 6700 },
    { date: 'Oct 10', balance: 6900 },
    { date: 'Oct 15', balance: 7100 },
    { date: 'Oct 20', balance: 7000 },
    { date: 'Oct 25', balance: 7200 },
    { date: 'Nov 1', balance: account.balance },
  ]

  const utilizationPercentage = account.creditLimit
    ? ((Math.abs(account.balance) / account.creditLimit) * 100).toFixed(2)
    : null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{account.name}</CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold">
                  ${Math.abs(account.balance).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              {account.creditLimit && (
                <div>
                  <p className="text-sm text-muted-foreground">/ ${account.creditLimit.toLocaleString()}</p>
                </div>
              )}
            </div>
            {utilizationPercentage && (
              <div className="mt-2">
                <div className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                  parseFloat(utilizationPercentage) > 70
                    ? 'bg-red-100 text-red-800'
                    : parseFloat(utilizationPercentage) > 50
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {utilizationPercentage}% utilized
                </div>
              </div>
            )}
          </div>
          <Tabs value={timePeriod} onValueChange={setTimePeriod}>
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
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
