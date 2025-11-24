import { useEffect } from 'react'

export interface KeyboardShortcutOptions {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  preventDefault?: boolean
  enabled?: boolean
}

/**
 * Custom hook for handling keyboard shortcuts
 * @param callback - Function to call when shortcut is pressed
 * @param options - Keyboard shortcut configuration
 */
export function useKeyboardShortcut(
  callback: (event: KeyboardEvent) => void,
  options: KeyboardShortcutOptions
) {
  const {
    key,
    ctrlKey = false,
    metaKey = false,
    shiftKey = false,
    altKey = false,
    preventDefault = true,
    enabled = true,
  } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if all modifier keys match
      const modifiersMatch =
        event.ctrlKey === ctrlKey &&
        event.metaKey === metaKey &&
        event.shiftKey === shiftKey &&
        event.altKey === altKey

      // Check if the key matches (case-insensitive)
      const keyMatches = event.key.toLowerCase() === key.toLowerCase()

      if (modifiersMatch && keyMatches) {
        if (preventDefault) {
          event.preventDefault()
        }
        callback(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback, key, ctrlKey, metaKey, shiftKey, altKey, preventDefault, enabled])
}

/**
 * Hook specifically for Cmd+K / Ctrl+K shortcut
 */
export function useCmdK(callback: () => void, enabled = true) {
  useKeyboardShortcut(callback, {
    key: 'k',
    metaKey: true,
    enabled,
  })

  // Also support Ctrl+K for non-Mac users
  useKeyboardShortcut(callback, {
    key: 'k',
    ctrlKey: true,
    enabled,
  })
}
