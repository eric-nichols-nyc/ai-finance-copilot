'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

type Transaction = {
  id: string
  amount: number
  description: string | null
  date: Date
  type: string
  categoryId: string
  category?: {
    id: string
    name: string
    type: string
  }
}

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
  transactions?: Transaction[]
}

type RecurringMonthlyListProps = {
  recurring: Recurring | null
  transactions?: Transaction[]
}

export function RecurringMonthlyList({ recurring, transactions = [] }: RecurringMonthlyListProps) {
  if (!recurring) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">Select a recurring charge to view transactions</p>
        </CardContent>
      </Card>
    )
  }

  // Use provided transactions or fallback to recurring's transactions
  const displayTransactions = transactions.length > 0 ? transactions : (recurring.transactions || [])

  // Mock data if no transactions
  const mockTransactions = displayTransactions.length === 0 ? [
    {
      id: '1',
      description: recurring.name,
      amount: recurring.amount,
      date: new Date('2025-11-01'),
      type: 'EXPENSE',
      categoryId: recurring.categoryId,
      category: recurring.category,
      accountId: recurring.accountId,
      accountName: recurring.account.name,
    },
    {
      id: '2',
      description: recurring.name,
      amount: recurring.amount,
      date: new Date('2025-10-01'),
      type: 'EXPENSE',
      categoryId: recurring.categoryId,
      category: recurring.category,
      accountId: recurring.accountId,
      accountName: recurring.account.name,
    },
    {
      id: '3',
      description: recurring.name,
      amount: recurring.amount,
      date: new Date('2025-09-01'),
      type: 'EXPENSE',
      categoryId: recurring.categoryId,
      category: recurring.category,
      accountId: recurring.accountId,
      accountName: recurring.account.name,
    },
  ] : []

  const allTransactions = displayTransactions.length > 0 ? displayTransactions : mockTransactions

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

  const getCategoryIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      SUBSCRIPTIONS: '🎵',
      RENT: '🏠',
      CAR: '🚗',
      UTILITIES: '💡',
      SHOPS: '🛍️',
      OTHER: '📦',
    }
    return iconMap[type.toUpperCase()] || '📦'
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Transactions</CardTitle>
        <Button size="sm" variant="ghost" className="text-muted-foreground">
          ADD
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {allTransactions.map((transaction: any) => {
            const date = new Date(transaction.date)
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-center min-w-[45px]">
                    <p className="text-sm font-medium">
                      {monthNames[date.getMonth()]} {date.getDate()}
                    </p>
                  </div>
                  <div className="text-xl">{getCategoryIcon(transaction.category?.type || recurring.category.type)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{transaction.description || recurring.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.accountName || recurring.account.name} {transaction.accountId?.slice(-4) || recurring.account.id.slice(-4)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getCategoryColor(transaction.category?.type || recurring.category.type)} text-white text-xs`}>
                    {(transaction.category?.name || recurring.category.name).toUpperCase()}
                  </Badge>
                  <p className="font-bold min-w-[80px] text-right">
                    ${transaction.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
