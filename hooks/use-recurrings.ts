'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getRecurringsBasicData,
  type RecurringsBasicDataResult,
} from '@/actions/get-recurrings-basic-data'

/**
 * Query keys for recurrings-related queries.
 * Centralized to ensure consistency across the app.
 */
export const recurringsKeys = {
  all: ['recurrings'] as const,
  basic: () => [...recurringsKeys.all, 'basic'] as const,
  detail: (id: string) => [...recurringsKeys.all, 'detail', id] as const,
  transactions: (id: string) => [...recurringsKeys.all, 'transactions', id] as const,
}

/**
 * Hook to fetch recurring charges data (without transactions).
 * Use this for the recurrings page where you need detailed recurring info.
 *
 * Features:
 * - Cached for 5 minutes
 * - Refetches on window focus
 * - Automatically refetches on recurring mutations
 *
 * @example
 * ```tsx
 * function RecurringsPage() {
 *   const { data, isLoading, error } = useRecurringsBasic()
 *
 *   if (isLoading) return <LoadingSpinner />
 *   if (error || !data?.success) return <ErrorMessage />
 *
 *   return <RecurringsList recurrings={data.recurrings} />
 * }
 * ```
 */
export function useRecurringsBasic() {
  return useQuery<RecurringsBasicDataResult>({
    queryKey: recurringsKeys.basic(),
    queryFn: () => getRecurringsBasicData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Helper hook to invalidate all recurrings queries.
 * Use this after recurring mutations (create, update, delete).
 *
 * @example
 * ```tsx
 * function CreateRecurringButton() {
 *   const invalidateRecurrings = useInvalidateRecurrings()
 *
 *   const handleCreate = async () => {
 *     await createRecurring(data)
 *     invalidateRecurrings() // Refetch all recurring queries
 *   }
 * }
 * ```
 */
export function useInvalidateRecurrings() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: recurringsKeys.all })
  }
}
