'use client'

import { Plus } from 'lucide-react'
import { TotalAccountsChart } from './total-accounts-chart'
import { AccountsAccordion } from './accounts-accordion'
import { AddAccountModal } from './add-account-modal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAccountsBasic } from '@/hooks/use-accounts'
import { useState, useEffect } from 'react'

/**
 * Left Panel Component for Accounts Layout
 * Displays accounts overview, debt chart, and categorized accounts list
 */
export function AccountsLeftPanel() {
  const { data: accountsResult, isLoading: isLoadingAccounts, error: accountsError } = useAccountsBasic()
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>()

  // Auto-select first account when accounts load
  useEffect(() => {
    if (accountsResult?.success && accountsResult.accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accountsResult.accounts[0].id)
    }
  }, [accountsResult, selectedAccountId])

  // Loading state
  if (isLoadingAccounts) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96 mt-1" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  // Error state
  if (accountsError || !accountsResult?.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your financial accounts
          </p>
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

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold">Accounts</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all your financial accounts
        </p>
      </div>

      {/* Add Account Button */}
      <AddAccountModal>
        <Button size="default" className="gap-2 w-full">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </AddAccountModal>

      {/* Accounts Overview Chart with Debt Tracking */}
      <TotalAccountsChart accounts={accounts} />

      {/* Categorized Accounts List */}
      <AccountsAccordion
        accounts={accounts}
        onAccountSelect={setSelectedAccountId}
        selectedAccountId={selectedAccountId}
      />
    </div>
  )
}
