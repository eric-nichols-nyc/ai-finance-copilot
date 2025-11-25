/**
 * Test helper utilities
 * Common functions used across test files
 */

import { expect } from 'vitest'

/**
 * Compare numeric values in tests with tolerance for floating point
 * Useful for comparing financial calculations
 */
export function expectDecimalEqual(actual: number | any, expected: number) {
  const actualNum = typeof actual === 'number' ? actual : Number(actual)
  expect(actualNum).toBeCloseTo(expected, 2)
}

/**
 * Create a date from a string for consistent testing
 */
export function createDate(dateString: string): Date {
  return new Date(dateString)
}

/**
 * Get the first day of a month
 */
export function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month - 1, 1)
}

/**
 * Get the last day of a month
 */
export function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 0, 23, 59, 59, 999)
}

/**
 * Wait for a specific amount of time (useful for async tests)
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Mock environment variables for testing
 */
export function mockEnv(vars: Record<string, string>) {
  const originalEnv = { ...process.env }

  Object.entries(vars).forEach(([key, value]) => {
    process.env[key] = value
  })

  return () => {
    process.env = originalEnv
  }
}

/**
 * Suppress console output during tests
 */
export function suppressConsole() {
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
  }

  console.log = vi.fn()
  console.error = vi.fn()
  console.warn = vi.fn()

  return () => {
    console.log = originalConsole.log
    console.error = originalConsole.error
    console.warn = originalConsole.warn
  }
}

/**
 * Create a range of dates for testing
 */
export function createDateRange(start: string, end: string): Date[] {
  const dates: Date[] = []
  const startDate = new Date(start)
  const endDate = new Date(end)

  const current = new Date(startDate)
  while (current <= endDate) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

/**
 * Format a number to 2 decimal places for comparison
 */
export function roundTo2Decimals(num: number): number {
  return Math.round(num * 100) / 100
}
