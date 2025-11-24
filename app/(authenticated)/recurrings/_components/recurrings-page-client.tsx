'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { TotalRecurringsChart } from './total-recurrings-chart'
import { RecurringsAccordion } from './recurrings-accordion'
import { RecurringDetailChart } from './recurring-detail-chart'
import { RecurringMonthlyList } from './recurring-monthly-list'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecurringsBasic } from '@/hooks/use-recurrings'
import { useRecurringTransactions } from '@/hooks/use-recurring-transactions'

/**
 * Optimized Recurrings Page Client Component with React Query.
 *
 * Key Optimizations:
 * - Loads recurrings WITHOUT transactions first (fast initial load)
 * - Lazily loads transactions only when recurring is selected
 * - Caches data for instant page transitions
 * - Automatic refetching on window focus
 */
export function RecurringsPageClient() {
  const { data: recurringsResult, isLoading: isLoadingRecurrings, error: recurringsError } = useRecurringsBasic()

  // State for selected recurring
  const [selectedRecurringId, setSelectedRecurringId] = useState<string | undefined>()

  // Auto-select first recurring when recurrings load
  useEffect(() => {
    if (recurringsResult?.success && recurringsResult.recurrings.length > 0 && !selectedRecurringId) {
      setSelectedRecurringId(recurringsResult.recurrings[0].id)
    }
  }, [recurringsResult, selectedRecurringId])

  // Fetch transactions for selected recurring (lazy loading)
  const { data: transactionsResult, isLoading: isLoadingTransactions } = useRecurringTransactions(
    selectedRecurringId,
    { limit: 100, includeCategory: true }
  )

  // Loading state
  if (isLoadingRecurrings) {
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
  if (recurringsError || !recurringsResult?.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Recurrings</h1>
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
              <h3 className="text-lg font-semibold text-red-900">Error Loading Recurring Charges</h3>
              <p className="mt-1 text-sm text-red-700">
                {recurringsResult?.error || 'Failed to load recurring charges'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const recurrings = recurringsResult.recurrings

  // Convert recurring to include transactions (for compatibility with existing components)
  const recurringsWithTransactions = recurrings.map(recurring => ({
    ...recurring,
    transactions: recurring.id === selectedRecurringId && transactionsResult?.success
      ? transactionsResult.transactions
      : [],
  }))

  const selectedRecurring = recurringsWithTransactions.find((r) => r.id === selectedRecurringId) || null

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold">Recurrings</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all your recurring charges
        </p>
      </div>

      {/* Split Layout with Center Border */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="flex flex-col gap-6">
          {/* Add Recurring Button */}
          <Button size="default" className="gap-2 w-full lg:w-auto">
            <Plus className="h-4 w-4" />
            Add Recurring
          </Button>

          {/* Total Recurrings Chart */}
          <TotalRecurringsChart recurrings={recurringsWithTransactions} />

          {/* Recurrings Accordion */}
          <RecurringsAccordion
            recurrings={recurringsWithTransactions}
            onRecurringSelect={setSelectedRecurringId}
            selectedRecurringId={selectedRecurringId}
          />
        </div>

        {/* Right Panel with Left Border */}
        <div className="flex flex-col gap-6 lg:border-l lg:pl-6">
          {/* Recurring Detail Chart - Show loading state while transactions are loading */}
          {isLoadingTransactions && selectedRecurringId ? (
            <Skeleton className="h-[500px] w-full" />
          ) : (
            <RecurringDetailChart recurring={selectedRecurring} />
          )}

          {/* Monthly Transactions List - Show loading state while transactions are loading */}
          {isLoadingTransactions && selectedRecurringId ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <RecurringMonthlyList
              recurring={selectedRecurring}
              transactions={transactionsResult?.success ? transactionsResult.transactions : []}
            />
          )}
        </div>
      </div>
    </div>
  )
}
