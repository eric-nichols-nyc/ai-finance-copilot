import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { SearchResult } from '@/app/api/search/route'

// Debounce utility
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface UseSearchResultsOptions {
  query: string
  entities?: string[]
  limit?: number
  debounceMs?: number
  enabled?: boolean
}

export function useSearchResults({
  query,
  entities,
  limit = 5,
  debounceMs = 300,
  enabled = true,
}: UseSearchResultsOptions) {
  const debouncedQuery = useDebounce(query, debounceMs)

  const { data, isLoading, error, isFetching } = useQuery<SearchResult>({
    queryKey: ['search', debouncedQuery, entities, limit],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        return {
          transactions: [],
          accounts: [],
          recurring: [],
          categories: [],
          budgets: [],
          interestPayments: [],
        }
      }

      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: limit.toString(),
      })

      if (entities && entities.length > 0) {
        params.set('entities', entities.join(','))
      }

      const response = await fetch(`/api/search?${params}`)

      if (!response.ok) {
        throw new Error('Search failed')
      }

      return response.json()
    },
    enabled: enabled && debouncedQuery.length >= 2, // Only search with 2+ characters
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 60000, // Keep in cache for 1 minute
  })

  // Calculate total results
  const totalResults =
    (data?.transactions.length || 0) +
    (data?.accounts.length || 0) +
    (data?.recurring.length || 0) +
    (data?.categories.length || 0) +
    (data?.budgets.length || 0) +
    (data?.interestPayments.length || 0)

  return {
    results: data || {
      transactions: [],
      accounts: [],
      recurring: [],
      categories: [],
      budgets: [],
      interestPayments: [],
    },
    isLoading: isLoading || (isFetching && query !== debouncedQuery),
    error,
    totalResults,
    hasResults: totalResults > 0,
  }
}
