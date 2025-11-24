'use client'

import { Trash2, XCircle } from 'lucide-react'
import { AccountDetailChart } from './account-detail-chart'
import { AccountMonthlyList } from './account-monthly-list'
import { EditAccountModal } from './edit-account-modal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAccountsBasic } from '@/hooks/use-accounts'
import { useAccountTransactions } from '@/hooks/use-account-transactions'

interface AccountDetailViewProps {
  accountId: string
}

/**
 * Account Detail View Component
 * Displays detailed information for a specific account including:
 * - Account actions (edit, close, delete)
 * - Balance history chart
 * - Monthly transaction list
 */
export function AccountDetailView({ accountId }: AccountDetailViewProps) {
  const { data: accountsResult, isLoading: isLoadingAccounts } = useAccountsBasic()

  // Fetch transactions for the account
  const { data: transactionsResult, isLoading: isLoadingTransactions } = useAccountTransactions(
    accountId,
    { limit: 100, includeCategory: true }
  )

  const handleDeleteAccount = (accountId: string) => {
    // TODO: Implement delete account functionality
    console.log('Delete account:', accountId)
  }

  const handleCloseAccount = (accountId: string) => {
    // TODO: Implement close account functionality
    console.log('Close account:', accountId)
  }

  // Loading state
  if (isLoadingAccounts) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel Loading */}
        <div className="flex flex-col gap-6">
          <Skeleton className="h-64 w-full" />
        </div>
        {/* Right Panel Loading */}
        <div className="flex flex-col gap-6 lg:border-l lg:pl-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  // Error state
  if (!accountsResult?.success) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-900">Error Loading Account</h3>
            <p className="mt-1 text-sm text-red-700">
              {accountsResult?.error || 'Failed to load account'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const account = accountsResult.accounts.find(a => a.id === accountId)

  // Account not found
  if (!account) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-900">Account Not Found</h3>
            <p className="mt-1 text-sm text-yellow-700">
              The account with ID {accountId} could not be found.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Convert account to include transactions (for compatibility with existing components)
  const accountWithTransactions = {
    ...account,
    transactions: transactionsResult?.success
      ? transactionsResult.transactions.map(t => ({
          id: t.id,
          amount: t.amount,
          description: t.description,
          date: t.date,
          type: t.type,
        }))
      : [],
  }

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel */}
      <div className="flex flex-col gap-6">
        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Header */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold ${getAccountColor(account.type)}`}>
                {account.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold">{account.name}</h3>
                <p className="text-sm text-muted-foreground">{formatAccountType(account.type)}</p>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold">
                  ${Math.abs(account.balance).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              {isCredit && account.creditLimit && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Credit Limit</p>
                    <p className="text-xl font-semibold">
                      ${account.creditLimit.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  {utilization && (
                    <div>
                      <p className="text-sm text-muted-foreground">Credit Utilization</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-semibold">{utilization}%</p>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
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
                <p className="text-sm text-muted-foreground">Account ID</p>
                <p className="text-xs font-mono text-muted-foreground">{account.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel with Left Border */}
      <div className="flex flex-col gap-6 lg:border-l lg:pl-6">
        {/* Account Actions */}
        <div className="flex gap-2 justify-end">
          <EditAccountModal account={accountWithTransactions} />
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => handleCloseAccount(account.id)}
          >
            <XCircle className="h-4 w-4" />
            Close Account
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => handleDeleteAccount(account.id)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>

        {/* Account Detail Chart - Show loading state while transactions are loading */}
        {isLoadingTransactions ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <AccountDetailChart account={accountWithTransactions} />
        )}

        {/* Monthly Transactions List - Show loading state while transactions are loading */}
        {isLoadingTransactions ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <AccountMonthlyList account={accountWithTransactions} />
        )}
      </div>
    </div>
  )
}
