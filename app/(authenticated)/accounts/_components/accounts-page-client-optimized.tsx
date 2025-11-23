'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, XCircle } from 'lucide-react'
import { TotalAccountsChart } from './total-accounts-chart'
import { AccountsAccordion } from './accounts-accordion'
import { AccountDetailChart } from './account-detail-chart'
import { AccountMonthlyList } from './account-monthly-list'
import { AccountsDebugger } from './accounts-debugger'
import { AddAccountModal } from './add-account-modal'
import { EditAccountModal } from './edit-account-modal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAccountsBasic } from '@/hooks/use-accounts'
import { useAccountTransactions } from '@/hooks/use-account-transactions'

/**
 * Optimized Accounts Page Client Component with React Query.
 *
 * Key Optimizations:
 * - Loads accounts WITHOUT transactions first (fast initial load)
 * - Lazily loads transactions only when account is selected
 * - Caches data for instant page transitions
 * - Automatic refetching on window focus
 */
export function AccountsPageClientOptimized() {
  const { data: accountsResult, isLoading: isLoadingAccounts, error: accountsError } = useAccountsBasic()

  // State for selected account
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>()

  // Auto-select first account when accounts load
  useEffect(() => {
    if (accountsResult?.success && accountsResult.accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accountsResult.accounts[0].id)
    }
  }, [accountsResult, selectedAccountId])

  // Fetch transactions for selected account (lazy loading)
  const { data: transactionsResult, isLoading: isLoadingTransactions } = useAccountTransactions(
    selectedAccountId,
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
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96 mt-1" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-full lg:w-40" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="flex flex-col gap-6 lg:border-l lg:pl-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (accountsError || !accountsResult?.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
        </div>
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
              <h3 className="text-lg font-semibold text-red-900">Error Loading Accounts</h3>
              <p className="mt-1 text-sm text-red-700">
                {accountsResult?.error || 'Failed to load accounts'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const accounts = accountsResult.accounts

  // Convert account to include transactions (for compatibility with existing components)
  const accountsWithTransactions = accounts.map(account => ({
    ...account,
    transactions: account.id === selectedAccountId && transactionsResult?.success
      ? transactionsResult.transactions.map(t => ({
          id: t.id,
          amount: t.amount,
          description: t.description,
          date: t.date,
          type: t.type,
        }))
      : [],
  }))

  const selectedAccount = accountsWithTransactions.find((a) => a.id === selectedAccountId) || null

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold">Accounts</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all your financial accounts
        </p>
      </div>

      {/* Split Layout with Center Border */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="flex flex-col gap-6">
          {/* Add Account Button */}
          <AddAccountModal>
            <Button size="default" className="gap-2 w-full lg:w-auto">
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </AddAccountModal>

          {/* Total Accounts Chart */}
          <TotalAccountsChart accounts={accountsWithTransactions} />

          {/* Accounts Accordion */}
          <AccountsAccordion
            accounts={accountsWithTransactions}
            onAccountSelect={setSelectedAccountId}
            selectedAccountId={selectedAccountId}
          />
        </div>

        {/* Right Panel with Left Border */}
        <div className="flex flex-col gap-6 lg:border-l lg:pl-6">
          {/* Account Actions */}
          {selectedAccount && (
            <div className="flex gap-2 justify-end">
              <EditAccountModal account={selectedAccount} />
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleCloseAccount(selectedAccount.id)}
              >
                <XCircle className="h-4 w-4" />
                Close Account
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() => handleDeleteAccount(selectedAccount.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}

          {/* Account Detail Chart - Show loading state while transactions are loading */}
          {isLoadingTransactions && selectedAccountId ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <AccountDetailChart account={selectedAccount} />
          )}

          {/* Monthly Transactions List - Show loading state while transactions are loading */}
          {isLoadingTransactions && selectedAccountId ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <AccountMonthlyList account={selectedAccount} />
          )}
        </div>
      </div>

      {/* Debug Component (Development Only) */}
      <AccountsDebugger
        data={{
          accounts: accountsWithTransactions,
          transactionsLoading: isLoadingTransactions,
          transactionsCount: transactionsResult?.success ? transactionsResult.total : 0,
        }}
      />
    </div>
  )
}
