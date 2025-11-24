'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { SearchProvider } from '@/lib/search-context'

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each user session
  // This prevents sharing state between different users
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache persists for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Refetch on window focus for up-to-date data
            refetchOnWindowFocus: true,
            // Retry failed requests up to 1 time
            retry: 1,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        {children}
        {/* DevTools only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </SearchProvider>
    </QueryClientProvider>
  )
}
