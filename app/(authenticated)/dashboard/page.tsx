import { DashboardClient } from './_components/dashboard-client'

/**
 * Dashboard page - now uses React Query for efficient data loading and caching.
 * The client component handles loading states, error handling, and automatic refetching.
 */
export default function DashboardPage() {
  return <DashboardClient />
}
