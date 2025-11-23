'use client'

import { TotalExpenses } from './total-expenses'
import { RecurringPayments } from './recurring-payments'
import { LoanPayment } from './loan-payment'
import { CreditCards } from './credit-cards'
import { CreditCardsList } from './credit-cards-list'
import { RecurringAccountsList } from './recurring-accounts-list'
import { LoanAccountsList } from './loan-accounts-list'
import { UpcomingPaymentsList } from './upcoming-payments-list'
import { DashboardDebugger } from './DashboardDebugger'
import { useDashboard } from '@/hooks/use-dashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Client component for the dashboard that uses React Query for data fetching.
 * Provides loading states, error handling, and automatic refetching.
 */
export function DashboardClient() {
  const { data: result, isLoading, error } = useDashboard()

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {/* Summary Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Lists Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !result?.success) {
    return (
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        {/* Error Message */}
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
              <h3 className="text-lg font-semibold text-red-900">
                Error Loading Dashboard
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {result?.error || 'Failed to load dashboard data'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success case - render dashboard with data
  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <TotalExpenses accounts={result.accounts} />
        <CreditCards accounts={result.accounts} />
        <LoanPayment accounts={result.accounts} />
        <RecurringPayments upcomingRecurring={result.upcomingRecurring} />
      </div>

      {/* Detailed Lists - 2 Column Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Column 1 */}
        <div className="flex flex-col gap-6">
          <CreditCardsList accounts={result.accounts} />
          <RecurringAccountsList upcomingRecurring={result.upcomingRecurring} />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6">
          <LoanAccountsList accounts={result.accounts} />
          <UpcomingPaymentsList upcomingRecurring={result.upcomingRecurring} />
        </div>
      </div>

      {/* Debug Component (Development Only) */}
      <DashboardDebugger data={result} />
    </div>
  )
}
