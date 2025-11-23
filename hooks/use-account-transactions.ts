'use client'

import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAccountTransactions,
  type AccountTransactionsResult,
  type GetAccountTransactionsOptions,
} from '@/actions/get-account-transactions'

/**
 * Query keys for transaction-related queries.
 * Centralized to ensure consistency across the app.
 */
export const transactionsKeys = {
  all: ['transactions'] as const,
  byAccount: (accountId: string) =>
    [...transactionsKeys.all, 'account', accountId] as const,
  byAccountPaginated: (accountId: string, options: GetAccountTransactionsOptions) =>
    [...transactionsKeys.byAccount(accountId), 'paginated', options] as const,
}

/**
 * Hook to fetch paginated transactions for a specific account.
 * Use this for the accounts page where you want to show transactions on demand.
 *
 * Features:
 * - Cached for 5 minutes
 * - Refetches on window focus
 * - Supports pagination
 * - Only fetches when account is selected
 *
 * @param accountId - The account ID to fetch transactions for
 * @param options - Pagination and filtering options
 *
 * @example
 * ```tsx
 * function AccountTransactions({ accountId }: { accountId: string }) {
 *   const { data, isLoading, error } = useAccountTransactions(accountId, {
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
export function useAccountTransactions(
  accountId: string | null | undefined,
  options: GetAccountTransactionsOptions = {}
) {
  return useQuery<AccountTransactionsResult>({
    queryKey: transactionsKeys.byAccountPaginated(accountId || '', options),
    queryFn: () => getAccountTransactions(accountId!, options),
    enabled: !!accountId, // Only fetch if accountId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to fetch transactions with infinite scroll support.
 * Use this when you want to implement "load more" or infinite scroll patterns.
 *
 * Features:
 * - Automatically handles pagination
 * - Supports "load more" button or infinite scroll
 * - Caches all pages of data
 *
 * @param accountId - The account ID to fetch transactions for
 * @param limit - Number of transactions per page (default: 20)
 *
 * @example
 * ```tsx
 * function InfiniteTransactionsList({ accountId }: { accountId: string }) {
 *   const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isLoading,
 *   } = useAccountTransactionsInfinite(accountId)
 *
 *   if (isLoading) return <LoadingSpinner />
 *
 *   return (
 *     <>
 *       {data?.pages.map((page) =>
 *         page.success ? (
 *           page.transactions.map((t) => <TransactionCard key={t.id} {...t} />)
 *         ) : null
 *       )}
 *       {hasNextPage && (
 *         <Button onClick={() => fetchNextPage()}>Load More</Button>
 *       )}
 *     </>
 *   )
 * }
 * ```
 */
export function useAccountTransactionsInfinite(
  accountId: string | null | undefined,
  limit: number = 20
) {
  return useInfiniteQuery<AccountTransactionsResult>({
    queryKey: [...transactionsKeys.byAccount(accountId || ''), 'infinite'],
    queryFn: ({ pageParam = 0 }) =>
      getAccountTransactions(accountId!, {
        limit,
        offset: pageParam as number,
        includeCategory: true,
      }),
    enabled: !!accountId,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.success) return undefined
      if (!lastPage.hasMore) return undefined
      return allPages.length * limit
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Helper hook to invalidate transaction queries for a specific account.
 * Use this after transaction mutations (create, update, delete).
 *
 * @param accountId - Optional account ID to invalidate transactions for
 *
 * @example
 * ```tsx
 * function CreateTransactionButton({ accountId }: { accountId: string }) {
 *   const invalidateTransactions = useInvalidateTransactions()
 *
 *   const handleCreate = async () => {
 *     await createTransaction(data)
 *     invalidateTransactions(accountId) // Refetch transactions for this account
 *   }
 * }
 * ```
 */
export function useInvalidateTransactions() {
  const queryClient = useQueryClient()

  return (accountId?: string) => {
    if (accountId) {
      // Invalidate specific account's transactions
      queryClient.invalidateQueries({
        queryKey: transactionsKeys.byAccount(accountId),
      })
    } else {
      // Invalidate all transactions
      queryClient.invalidateQueries({
        queryKey: transactionsKeys.all,
      })
    }
  }
}
