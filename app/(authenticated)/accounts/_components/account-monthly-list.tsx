'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AddTransactionModal } from './add-transaction-modal'
import { EditTransactionModal } from './edit-transaction-modal'

type Transaction = {
  id: string
  amount: number
  description: string | null
  date: Date
  type: string
  notes?: string | null
  isRecurring?: boolean
  categoryId?: string | null
}

type Account = {
  id: string
  name: string
  type: string
  balance: number
  transactions: Transaction[]
}

type AccountMonthlyListProps = {
  account: Account | null
}

export function AccountMonthlyList({ account }: AccountMonthlyListProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  if (!account) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">Select an account to view transactions</p>
        </CardContent>
      </Card>
    )
  }

  // Group transactions by month
  const transactionsByMonth = account.transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date)
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    if (!acc[monthYear]) {
      acc[monthYear] = {
        total: 0,
        transactions: [],
      }
    }

    acc[monthYear].total += transaction.amount
    acc[monthYear].transactions.push(transaction)

    return acc
  }, {} as Record<string, { total: number; transactions: Transaction[] }>)

  const months = Object.keys(transactionsByMonth).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  // Mock data if no transactions
  const mockMonths = months.length === 0 ? [
    {
      name: 'November 2025',
      total: 38.92,
      transactions: [
        { id: '1', description: 'Hulu', amount: 11.99, date: new Date('2025-11-15'), type: 'EXPENSE', category: 'SUBSCRIPTIONS' },
        { id: '2', description: 'Audible', amount: 14.95, date: new Date('2025-11-13'), type: 'EXPENSE', category: 'SHOP' },
        { id: '3', description: 'Automatic Payment - Thank You', amount: -691.82, date: new Date('2025-11-04'), type: 'EXPENSE', category: 'OTHER' },
        { id: '4', description: 'Google Storage', amount: 1.99, date: new Date('2025-11-02'), type: 'EXPENSE', category: 'OTHER' },
        { id: '5', description: 'Spotify', amount: 9.99, date: new Date('2025-11-01'), type: 'EXPENSE', category: 'SUBSCRIPTIONS' },
      ],
    },
    {
      name: 'October 2025',
      total: 642.54,
      transactions: [
        { id: '6', description: "Waldo's Pizza", amount: 17.51, date: new Date('2025-10-30'), type: 'EXPENSE', category: 'RESTAURANTS' },
        { id: '7', description: 'Netflix', amount: 12.99, date: new Date('2025-10-28'), type: 'EXPENSE', category: 'SUBSCRIPTIONS' },
        { id: '8', description: 'Chick-fil-a', amount: 16.08, date: new Date('2025-10-27'), type: 'EXPENSE', category: 'RESTAURANTS' },
      ],
    },
  ] : []

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Transaction History</CardTitle>
          <AddTransactionModal
            accountId={account.id}
            accountName={account.name}
            accountType={account.type}
            currentBalance={account.balance}
          >
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </AddTransactionModal>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {months.length > 0 ? (
              months.map((month) => {
                const monthData = transactionsByMonth[month]
                return (
                  <div key={month}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{month}</h3>
                      <p className="font-bold">
                        ${Math.abs(monthData.total).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {monthData.transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-2 rounded hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <div>
                              <p className="font-medium text-sm">{transaction.description || 'Transaction'}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {transaction.type}
                            </Badge>
                            <p className="font-semibold">
                              ${Math.abs(transaction.amount).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              // Display mock data
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center py-4">
                  No transactions yet. Click "Add Transaction" to get started.
                </p>
                {mockMonths.map((month) => (
                  <div key={month.name}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-muted-foreground">{month.name} (Example)</h3>
                      <p className="font-bold text-muted-foreground">
                        ${Math.abs(month.total).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="space-y-2 opacity-50">
                      {month.transactions.map((transaction: any) => (
                        <div key={transaction.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm text-muted-foreground">{transaction.description || 'Transaction'}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              {transaction.category}
                            </Badge>
                            <p className="font-semibold text-muted-foreground">
                              {transaction.amount < 0 ? '-' : ''}
                              ${Math.abs(transaction.amount).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Transaction Modal */}
      {selectedTransaction && (
        <EditTransactionModal
          transaction={{
            id: selectedTransaction.id,
            amount: selectedTransaction.amount,
            description: selectedTransaction.description,
            date: selectedTransaction.date,
            type: selectedTransaction.type,
            notes: selectedTransaction.notes || null,
            isRecurring: selectedTransaction.isRecurring || false,
            categoryId: selectedTransaction.categoryId || null,
          }}
          accountType={account.type}
          currentBalance={account.balance}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </>
  )
}
