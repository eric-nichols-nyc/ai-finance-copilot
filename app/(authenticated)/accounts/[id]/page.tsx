import { AccountDetailView } from '../_components/account-detail-view'

interface AccountDetailPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Account Detail Page - Right Panel View
 *
 * Displays detailed information for a specific account in the right panel.
 * The left panel (accounts list) remains visible via layout.tsx.
 *
 * Route: /accounts/[id]
 * Example: /accounts/f58b3fdb-0f9f-43c5-aca2-e9d9a411a0de
 */
export default async function AccountDetailPage({ params }: AccountDetailPageProps) {
  const { id } = await params

  return (
    <div className="flex flex-col gap-6">
      {/* Account Detail View */}
      <AccountDetailView accountId={id} />
    </div>
  )
}
