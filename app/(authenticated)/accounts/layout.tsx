import { AccountsLeftPanel } from './_components/accounts-left-panel'

/**
 * Accounts Layout - Split View
 *
 * Layout Structure:
 * - Left Panel (50%): Persistent accounts list, overview chart, and categorized accounts
 * - Right Panel (50%): Dynamic content based on route (account details or default view)
 *
 * Routes:
 * - /accounts - Shows default accounts view on right
 * - /accounts/[id] - Shows individual account details on right
 */
export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 lg:h-[calc(100vh-8rem)] lg:overflow-hidden">
      {/* Split Layout: 50/50 with border separator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-full">
        {/* Left Panel - Persistent accounts list */}
        <div className="flex flex-col gap-6 lg:h-full lg:overflow-y-auto lg:pr-2">
          <AccountsLeftPanel />
        </div>

        {/* Right Panel - Dynamic content (children) with left border */}
        <div className="flex flex-col gap-6 lg:border-l lg:pl-6 lg:h-full lg:overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
