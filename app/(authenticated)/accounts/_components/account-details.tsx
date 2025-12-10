'use client'

import { Card, CardContent } from '@/components/ui/card'
import { type Account } from '@/types'

interface AccountDetailsProps {
  account: Account
}

export function AccountDetails({ account }: AccountDetailsProps) {
  // Helper function to format account type for display
  const formatAccountType = (type: string): string => {
    const typeMap: Record<string, string> = {
      CREDIT_CARD: 'Credit Card',
      CHECKING: 'Checking',
      SAVINGS: 'Savings',
      LOAN: 'Loan',
      INVESTMENT: 'Investment',
      MORTGAGE: 'Mortgage',
    }
    return typeMap[type] || type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Helper function to get account icon color
  const getAccountColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      CREDIT_CARD: 'bg-blue-500',
      CHECKING: 'bg-emerald-500',
      SAVINGS: 'bg-amber-500',
      INVESTMENT: 'bg-purple-500',
      LOAN: 'bg-orange-500',
      MORTGAGE: 'bg-red-500',
    }
    return colorMap[type] || 'bg-gray-500'
  }

  const isCredit = account.type === 'CREDIT_CARD'
  const utilization = isCredit && account.creditLimit
    ? ((Math.abs(account.balance) / account.creditLimit) * 100).toFixed(2)
    : null

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          {/* Top Row: Identity + Primary Balance */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Identity */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm ${getAccountColor(account.type)}`}>
                {account.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold leading-tight">{account.name}</h3>
                <p className="text-sm text-muted-foreground">{formatAccountType(account.type)}</p>
              </div>
            </div>

            {/* Primary Balance */}
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
              <p className="text-3xl font-bold tracking-tight">
                ${Math.abs(account.balance).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* Secondary Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t">
            {isCredit && account.creditLimit && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credit Limit</p>
                  <p className="font-semibold">
                    ${account.creditLimit.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                {utilization && (
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-sm text-muted-foreground mb-1">Utilization</p>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{utilization}%</span>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            parseFloat(utilization) > 75
                              ? 'bg-red-500'
                              : parseFloat(utilization) > 50
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(parseFloat(utilization), 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-1">Account ID</p>
              <p className="text-xs font-mono text-muted-foreground truncate" title={account.id}>
                {account.id}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
