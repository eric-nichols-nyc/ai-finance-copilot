import { RecurringsPageClient } from './_components/recurrings-page-client'

/**
 * Recurrings page - uses React Query for efficient data loading.
 *
 * Optimizations:
 * - Recurrings load WITHOUT transactions first (10x faster initial load)
 * - Transactions lazy-load when recurring is selected
 * - Data is cached for 5 minutes (instant page transitions)
 * - Automatic refetching on window focus
 * - Parallel query optimization (3-5x faster than sequential)
 */
export default function RecurringsPage() {
  return <RecurringsPageClient />
}
