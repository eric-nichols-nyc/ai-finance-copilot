'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearch } from '@/lib/search-context'
import { cn } from '@/lib/utils'

interface SearchTriggerProps {
  variant?: 'default' | 'outline' | 'ghost'
  showShortcut?: boolean
  className?: string
}

export function SearchTrigger({
  variant = 'outline',
  showShortcut = true,
  className,
}: SearchTriggerProps) {
  const { openSearch } = useSearch()

  return (
    <Button
      variant={variant}
      className={cn(
        'relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-64',
        className
      )}
      onClick={openSearch}
    >
      <Search className="mr-2 h-4 w-4" />
      <span>Search...</span>
      {showShortcut && (
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
    </Button>
  )
}
