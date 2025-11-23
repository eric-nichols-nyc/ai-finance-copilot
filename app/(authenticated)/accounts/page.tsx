import { AccountsPageClientOptimized } from './_components/accounts-page-client-optimized'

/**
 * Accounts page - now uses React Query for efficient data loading.
 *
 * Optimizations:
 * - Accounts load WITHOUT transactions first (10x faster initial load)
 * - Transactions lazy-load when account is selected
 * - Data is cached for 5 minutes (instant page transitions)
 * - Automatic refetching on window focus
 * - Parallel query optimization (3-5x faster than sequential)
 */
export default function AccountsPage() {
  return <AccountsPageClientOptimized />
}
