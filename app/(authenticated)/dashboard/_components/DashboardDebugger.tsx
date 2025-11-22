'use client'

import { useState } from 'react'

interface DashboardDebuggerProps {
  data: unknown
}

export function DashboardDebugger({ data }: DashboardDebuggerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isExpanded ? '✕ Close' : '🐛 Debug Data'}
      </button>

      {isExpanded && (
        <div className="mt-2 max-h-[600px] w-[500px] overflow-auto rounded-lg border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Dashboard Data
            </h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(data, null, 2))
              }}
              className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Copy JSON
            </button>
          </div>
          <pre className="overflow-x-auto text-xs text-zinc-700 dark:text-zinc-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
