'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAccountsSummary,
  type AccountsSummaryResult,
} from '@/actions/get-accounts-summary'
import {
  getAccountsBasicData,
  type AccountsBasicDataResult,
} from '@/actions/get-accounts-basic-data'

/**
 * Query keys for accounts-related queries.
 * Centralized to ensure consistency across the app.
 */
export const accountsKeys = {
  all: ['accounts'] as const,
  summary: () => [...accountsKeys.all, 'summary'] as const,
  basic: () => [...accountsKeys.all, 'basic'] as const,
  detail: (id: string) => [...accountsKeys.all, 'detail', id] as const,
}

/**
 * Hook to fetch lightweight account summary for sidebar and layout.
 * This is the PRIMARY hook for getting account data across the app.
 *
 * Features:
 * - Cached for 5 minutes
 * - Refetches on window focus
 * - Automatically refetches on account mutations
 *
 * @example
 * ```tsx
 * function Sidebar() {
 *   const { data, isLoading, error } = useAccountsSummary()
 *
 *   if (isLoading) return <Skeleton />
 *   if (error || !data?.success) return <ErrorMessage />
 *
 *   return <AccountsList accounts={data.data.creditCards} />
 * }
 * ```
 */
export function useAccountsSummary() {
  return useQuery<AccountsSummaryResult>({
    queryKey: accountsKeys.summary(),
    queryFn: () => getAccountsSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to fetch full account data (without transactions).
 * Use this for the accounts page where you need detailed account info.
 *
 * Features:
 * - Cached for 5 minutes
 * - Refetches on window focus
 * - Automatically refetches on account mutations
 *
 * @example
 * ```tsx
 * function AccountsPage() {
 *   const { data, isLoading, error } = useAccountsBasic()
 *
 *   if (isLoading) return <LoadingSpinner />
 *   if (error || !data?.success) return <ErrorMessage />
 *
 *   return <AccountsList accounts={data.accounts} />
 * }
 * ```
 */
export function useAccountsBasic() {
  return useQuery<AccountsBasicDataResult>({
    queryKey: accountsKeys.basic(),
    queryFn: () => getAccountsBasicData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Helper hook to invalidate all accounts queries.
 * Use this after account mutations (create, update, delete).
 *
 * @example
 * ```tsx
 * function CreateAccountButton() {
 *   const invalidateAccounts = useInvalidateAccounts()
 *
 *   const handleCreate = async () => {
 *     await createAccount(data)
 *     invalidateAccounts() // Refetch all account queries
 *   }
 * }
 * ```
 */
export function useInvalidateAccounts() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: accountsKeys.all })
  }
}
