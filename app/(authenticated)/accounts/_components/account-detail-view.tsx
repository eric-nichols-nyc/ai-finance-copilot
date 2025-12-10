'use client'

import { Trash2, XCircle } from 'lucide-react'
import { AccountDetailChart } from './account-detail-chart'
import { AccountMonthlyList } from './account-monthly-list'
import { EditAccountModal } from './edit-account-modal'
import { AccountDetails } from './account-details'
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

  return (
    <div className="grid grid-cols-1 gap-6">
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


      {/* Right Panel with Left Border */}
      <div className="flex flex-col gap-6 lg:border-l lg:pl-6">



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
