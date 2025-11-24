import { AccountDetailView } from '../_components/account-detail-view'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AccountDetailPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Account Detail Page
 * Displays detailed information for a specific account.
 *
 * Route: /accounts/[id]
 * Example: /accounts/f58b3fdb-0f9f-43c5-aca2-e9d9a411a0de
 */
export default async function AccountDetailPage({ params }: AccountDetailPageProps) {
  const { id } = await params

  return (
    <div className="flex flex-col gap-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/accounts">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Accounts
          </Button>
        </Link>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold">Account Details</h1>
        <p className="text-muted-foreground mt-1">
          View and manage account transactions and balance history
        </p>
      </div>

      {/* Account Detail View */}
      <AccountDetailView accountId={id} />
    </div>
  )
}
