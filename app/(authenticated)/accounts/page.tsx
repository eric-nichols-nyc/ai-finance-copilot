import { getAccountsData } from '@/actions/get-accounts-data'
import { AccountsPageClient } from './_components/accounts-page-client'

export default async function AccountsPage() {
  const result = await getAccountsData()

  // Handle error case
  if (!result.success) {
    return (
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
        </div>

        {/* Error Message */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">
                Error Loading Accounts
              </h3>
              <p className="mt-1 text-sm text-red-700">{result.error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success case - render accounts page with data
  return <AccountsPageClient accounts={result.accounts} />
}
