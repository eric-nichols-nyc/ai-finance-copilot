'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface SearchContextType {
  isOpen: boolean
  query: string
  recentSearches: string[]
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
  setQuery: (query: string) => void
  addRecentSearch: (search: string) => void
  clearRecentSearches: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

const RECENT_SEARCHES_KEY = 'ai-finance-recent-searches'
const MAX_RECENT_SEARCHES = 5

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error)
    }
  }, [])

  const openSearch = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
    // Clear query when closing
    setQuery('')
  }, [])

  const toggleSearch = useCallback(() => {
    setIsOpen((prev) => !prev)
    if (isOpen) {
      setQuery('')
    }
  }, [isOpen])

  const addRecentSearch = useCallback((search: string) => {
    if (!search.trim()) return

    setRecentSearches((prev) => {
      // Remove duplicates and add to front
      const filtered = prev.filter((s) => s !== search)
      const updated = [search, ...filtered].slice(0, MAX_RECENT_SEARCHES)

      // Save to localStorage
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to save recent searches:', error)
      }

      return updated
    })
  }, [])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch (error) {
      console.error('Failed to clear recent searches:', error)
    }
  }, [])

  const value = {
    isOpen,
    query,
    recentSearches,
    openSearch,
    closeSearch,
    toggleSearch,
    setQuery,
    addRecentSearch,
    clearRecentSearches,
  }

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
