'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AIChatPanel } from '@/components/ai-chat-panel'

const navItems = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Transactions', href: '/transactions', icon: '💳' },
  { name: 'Cash Flow', href: '/cash-flow', icon: '💰' },
  { name: 'Accounts', href: '/accounts', icon: '🏦' },
  { name: 'Categories', href: '/categories', icon: '🏷️' },
  { name: 'Recurring', href: '/recurring', icon: '🔄' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-zinc-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">💼 Finance AI</h1>
            <p className="text-sm text-zinc-400 mt-1">demo@example.com</p>
          </div>
          <AIChatPanel />
        </div>
      </div>

      <div className="flex-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-300 hover:bg-zinc-800'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500">
        AI Finance Copilot v1.0
      </div>
    </nav>
  )
}
