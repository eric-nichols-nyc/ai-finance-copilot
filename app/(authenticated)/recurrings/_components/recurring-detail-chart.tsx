'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Recurring = {
  id: string
  name: string
  amount: number
  frequency: string
  nextDueDate: Date
  accountId: string
  categoryId: string
  account: {
    id: string
    name: string
    type: string
  }
  category: {
    id: string
    name: string
    type: string
  }
}

type RecurringDetailChartProps = {
  recurring: Recurring | null
}

export function RecurringDetailChart({ recurring }: RecurringDetailChartProps) {
  if (!recurring) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">Select a recurring charge to view details</p>
        </CardContent>
      </Card>
    )
  }

  const nextDueDate = new Date(recurring.nextDueDate)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Calculate key metrics
  const calculateYearlyAmount = () => {
    switch (recurring.frequency.toLowerCase()) {
      case 'monthly':
        return recurring.amount * 12
      case 'weekly':
        return recurring.amount * 52
      case 'biweekly':
        return recurring.amount * 26
      case 'quarterly':
        return recurring.amount * 4
      case 'yearly':
        return recurring.amount
      default:
        return recurring.amount * 12
    }
  }

  const yearlyAmount2025 = calculateYearlyAmount()
  const yearlyAmount2024 = yearlyAmount2025 // For now, use the same value

  // Generate payment timeline (months of the year)
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const currentMonth = new Date().getMonth()

  // Determine which months have payments based on frequency
  const getPaymentMonths = () => {
    const frequency = recurring.frequency.toLowerCase()
    if (frequency === 'monthly') return months.map((_, i) => i)
    if (frequency === 'quarterly') return [0, 3, 6, 9]
    if (frequency === 'yearly') return [nextDueDate.getMonth()]
    // For weekly/biweekly, show all months
    return months.map((_, i) => i)
  }

  const paymentMonths = getPaymentMonths()

  // Category badge color
  const getCategoryColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      SUBSCRIPTIONS: 'bg-purple-500 hover:bg-purple-600',
      RENT: 'bg-orange-500 hover:bg-orange-600',
      CAR: 'bg-blue-500 hover:bg-blue-600',
      UTILITIES: 'bg-amber-500 hover:bg-amber-600',
      SHOPS: 'bg-pink-500 hover:bg-pink-600',
      OTHER: 'bg-gray-500 hover:bg-gray-600',
    }
    return colorMap[type.toUpperCase()] || 'bg-gray-500 hover:bg-gray-600'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {recurring.category.type === 'SUBSCRIPTIONS' ? '🎵' :
               recurring.category.type === 'RENT' ? '🏠' :
               recurring.category.type === 'CAR' ? '🚗' :
               recurring.category.type === 'UTILITIES' ? '💡' :
               recurring.category.type === 'SHOPS' ? '🛍️' : '📦'}
            </div>
            <div>
              <CardTitle className="text-2xl">{recurring.name}</CardTitle>
              <Badge className={`${getCategoryColor(recurring.category.type)} text-white text-xs mt-1`}>
                {recurring.category.name.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">NEXT PAYMENT</p>
            <p className="text-3xl font-bold">
              ${recurring.amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              around {monthNames[nextDueDate.getMonth()]} {nextDueDate.getDate()}
              {nextDueDate.getDate() === 1 ? 'st' : nextDueDate.getDate() === 2 ? 'nd' : nextDueDate.getDate() === 3 ? 'rd' : 'th'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rules Section */}
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-3">RULES</p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-sm">Named {recurring.name}</Badge>
            <Badge variant="outline" className="text-sm">from ${recurring.amount.toFixed(0)} to ${(recurring.amount * 1.1).toFixed(0)}</Badge>
            <Badge variant="outline" className="text-sm">on any day of the month</Badge>
            <Badge variant="outline" className="text-sm capitalize">every {recurring.frequency}</Badge>
          </div>
        </div>

        {/* Payment Timeline */}
        <div>
          <div className="flex justify-between items-center mb-2">
            {months.map((month, index) => (
              <div key={month} className="text-center flex-1">
                <p className="text-[10px] text-muted-foreground">{month}</p>
              </div>
            ))}
          </div>
          <div className="relative h-8 flex items-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-muted-foreground/30"></div>
            </div>
            <div className="relative flex justify-between items-center w-full">
              {months.map((_, index) => (
                <div key={index} className="flex-1 flex justify-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      paymentMonths.includes(index)
                        ? index <= currentMonth
                          ? 'bg-pink-500'
                          : 'bg-pink-500'
                        : 'bg-transparent'
                    } ${index === currentMonth && paymentMonths.includes(index) ? 'ring-4 ring-pink-300' : ''}`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Key metrics</p>
            <div className="flex gap-8 text-sm">
              <p className="text-muted-foreground">Spent per year</p>
              <p className="text-muted-foreground">Avg transaction</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm">2025</p>
              <div className="flex gap-8">
                <p className="font-semibold w-24 text-right">
                  ${yearlyAmount2025.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="font-semibold w-24 text-right">
                  ${recurring.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">2024</p>
              <div className="flex gap-8">
                <p className="font-semibold w-24 text-right">
                  ${yearlyAmount2024.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="font-semibold w-24 text-right">
                  ${recurring.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Last Account Used */}
        <div>
          <p className="text-sm font-semibold mb-3">Last account used</p>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {recurring.account.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{recurring.account.name}</p>
              <p className="text-xs text-muted-foreground">12 hours ago</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-yellow-600 font-medium">⚡ +44.46%</p>
              <p className="text-lg font-bold">
                ${Math.abs(6669.43).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
