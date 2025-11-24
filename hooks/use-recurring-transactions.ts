'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getRecurringTransactions,
  type RecurringTransactionsResult,
  type GetRecurringTransactionsOptions,
} from '@/actions/get-recurring-transactions'
import { recurringsKeys } from './use-recurrings'

/**
 * Hook to fetch transactions for a specific recurring charge.
 * Use this for the recurrings page where you want to show transactions on demand.
 *
 * Features:
 * - Cached for 5 minutes
 * - Refetches on window focus
 * - Only fetches when recurring charge is selected
 *
 * @param recurringId - The recurring charge ID to fetch transactions for
 * @param options - Pagination and filtering options
 *
 * @example
 * ```tsx
 * function RecurringTransactions({ recurringId }: { recurringId: string }) {
 *   const { data, isLoading, error } = useRecurringTransactions(recurringId, {
 *     limit: 20,
 *     offset: 0,
 *   })
 *
 *   if (isLoading) return <LoadingSpinner />
 *   if (error || !data?.success) return <ErrorMessage />
 *
 *   return <TransactionsList transactions={data.transactions} />
 * }
 * ```
 */
export function useRecurringTransactions(
  recurringId: string | null | undefined,
  options: GetRecurringTransactionsOptions = {}
) {
  return useQuery<RecurringTransactionsResult>({
    queryKey: [...recurringsKeys.transactions(recurringId || ''), options],
    queryFn: () => getRecurringTransactions(recurringId!, options),
    enabled: !!recurringId, // Only fetch if recurringId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Helper hook to invalidate transaction queries for a specific recurring charge.
 * Use this after transaction mutations (create, update, delete).
 *
 * @param recurringId - Optional recurring charge ID to invalidate transactions for
 *
 * @example
 * ```tsx
 * function CreateTransactionButton({ recurringId }: { recurringId: string }) {
 *   const invalidateRecurringTransactions = useInvalidateRecurringTransactions()
 *
 *   const handleCreate = async () => {
 *     await createTransaction(data)
 *     invalidateRecurringTransactions(recurringId) // Refetch transactions for this recurring
 *   }
 * }
 * ```
 */
export function useInvalidateRecurringTransactions() {
  const queryClient = useQueryClient()

  return (recurringId?: string) => {
    if (recurringId) {
      // Invalidate specific recurring's transactions
      queryClient.invalidateQueries({
        queryKey: recurringsKeys.transactions(recurringId),
      })
    } else {
      // Invalidate all recurrings (including their transactions)
      queryClient.invalidateQueries({
        queryKey: recurringsKeys.all,
      })
    }
  }
}
