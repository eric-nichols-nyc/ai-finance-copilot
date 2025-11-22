'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-zinc-50">
          <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-zinc-900">
                Application Error
              </h1>
              <p className="text-sm text-zinc-600">
                A critical error occurred. Please refresh the page or contact support if the problem persists.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={reset}
                className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Try again
              </button>
              <a
                href="/"
                className="w-full rounded-md border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Go back home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
