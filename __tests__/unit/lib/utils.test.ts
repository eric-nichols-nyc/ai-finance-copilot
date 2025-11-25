import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  cn,
  formatCurrency,
  formatDate,
  formatDateShort,
  getStartOfMonth,
  getEndOfMonth,
  getDaysUntil,
  calculateUtilization,
  getUtilizationColor,
} from '@/lib/utils'

describe('cn - className merger', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('should merge Tailwind classes properly', () => {
    // twMerge should deduplicate and merge conflicting classes
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('should handle empty input', () => {
    expect(cn()).toBe('')
  })
})

describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('should format negative numbers correctly', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
  })

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('should round to 2 decimal places', () => {
    expect(formatCurrency(1.234)).toBe('$1.23')
  })

  it('should handle large numbers with commas', () => {
    expect(formatCurrency(1234567.89)).toBe('$1,234,567.89')
  })

  it('should handle very small positive numbers', () => {
    expect(formatCurrency(0.01)).toBe('$0.01')
  })

  it('should handle very small negative numbers', () => {
    expect(formatCurrency(-0.01)).toBe('-$0.01')
  })
})

describe('formatDate', () => {
  it('should format Date objects correctly', () => {
    const date = new Date('2024-11-15')
    expect(formatDate(date)).toBe('Nov 15, 2024')
  })

  it('should format date strings correctly', () => {
    expect(formatDate('2024-11-15')).toBe('Nov 15, 2024')
  })

  it('should handle different months', () => {
    expect(formatDate('2024-01-01')).toBe('Jan 1, 2024')
    expect(formatDate('2024-12-31')).toBe('Dec 31, 2024')
  })

  it('should handle leap year dates', () => {
    expect(formatDate('2024-02-29')).toBe('Feb 29, 2024')
  })
})

describe('formatDateShort', () => {
  it('should format Date objects without year', () => {
    const date = new Date('2024-11-15')
    expect(formatDateShort(date)).toBe('Nov 15')
  })

  it('should format date strings without year', () => {
    expect(formatDateShort('2024-11-15')).toBe('Nov 15')
  })

  it('should handle first and last days of month', () => {
    expect(formatDateShort('2024-01-01')).toBe('Jan 1')
    expect(formatDateShort('2024-12-31')).toBe('Dec 31')
  })
})

describe('getStartOfMonth', () => {
  beforeEach(() => {
    // Mock the current date to November 15, 2024
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-11-15T10:30:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return the first day of the current month', () => {
    const start = getStartOfMonth()
    expect(start.getFullYear()).toBe(2024)
    expect(start.getMonth()).toBe(10) // November is month 10 (0-indexed)
    expect(start.getDate()).toBe(1)
    expect(start.getHours()).toBe(0)
    expect(start.getMinutes()).toBe(0)
  })

  it('should return midnight time', () => {
    const start = getStartOfMonth()
    expect(start.getHours()).toBe(0)
    expect(start.getMinutes()).toBe(0)
    expect(start.getSeconds()).toBe(0)
    expect(start.getMilliseconds()).toBe(0)
  })
})

describe('getEndOfMonth', () => {
  beforeEach(() => {
    // Mock the current date to November 15, 2024
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-11-15T10:30:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return the last day of the current month', () => {
    const end = getEndOfMonth()
    expect(end.getFullYear()).toBe(2024)
    expect(end.getMonth()).toBe(10) // November
    expect(end.getDate()).toBe(30) // November has 30 days
  })

  it('should return end of day time', () => {
    const end = getEndOfMonth()
    expect(end.getHours()).toBe(23)
    expect(end.getMinutes()).toBe(59)
    expect(end.getSeconds()).toBe(59)
    expect(end.getMilliseconds()).toBe(999)
  })

  it('should handle February in non-leap year', () => {
    vi.setSystemTime(new Date('2023-02-15T10:30:00'))
    const end = getEndOfMonth()
    expect(end.getDate()).toBe(28)
  })

  it('should handle February in leap year', () => {
    vi.setSystemTime(new Date('2024-02-15T10:30:00'))
    const end = getEndOfMonth()
    expect(end.getDate()).toBe(29)
  })
})

describe('getDaysUntil', () => {
  beforeEach(() => {
    // Mock the current date to November 15, 2024
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-11-15T00:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should calculate days until future date', () => {
    expect(getDaysUntil(new Date('2024-11-20'))).toBe(5)
  })

  it('should handle dates in the past', () => {
    expect(getDaysUntil(new Date('2024-11-10'))).toBe(-5)
  })

  it('should handle today', () => {
    expect(getDaysUntil(new Date('2024-11-15'))).toBe(0)
  })

  it('should work with string dates', () => {
    expect(getDaysUntil('2024-11-20')).toBe(5)
  })

  it('should handle dates across month boundaries', () => {
    expect(getDaysUntil(new Date('2024-12-01'))).toBe(16)
  })

  it('should handle dates across year boundaries', () => {
    expect(getDaysUntil(new Date('2025-01-01'))).toBe(47)
  })
})

describe('calculateUtilization', () => {
  it('should calculate utilization percentage correctly', () => {
    expect(calculateUtilization(2500, 10000)).toBe(25)
  })

  it('should round to nearest integer', () => {
    expect(calculateUtilization(2555, 10000)).toBe(26) // 25.55 rounds to 26
  })

  it('should handle 0% utilization', () => {
    expect(calculateUtilization(0, 10000)).toBe(0)
  })

  it('should handle 100% utilization', () => {
    expect(calculateUtilization(10000, 10000)).toBe(100)
  })

  it('should handle over 100% utilization', () => {
    expect(calculateUtilization(12000, 10000)).toBe(120)
  })

  it('should handle zero limit', () => {
    expect(calculateUtilization(1000, 0)).toBe(0)
  })

  it('should handle decimal values', () => {
    expect(calculateUtilization(1234.56, 5000)).toBe(25) // 24.69 rounds to 25
  })

  it('should handle very small utilization', () => {
    expect(calculateUtilization(1, 10000)).toBe(0) // 0.01 rounds to 0
  })
})

describe('getUtilizationColor', () => {
  it('should return red for 90% or higher', () => {
    expect(getUtilizationColor(90)).toBe('text-red-600')
    expect(getUtilizationColor(95)).toBe('text-red-600')
    expect(getUtilizationColor(100)).toBe('text-red-600')
  })

  it('should return orange for 70-89%', () => {
    expect(getUtilizationColor(70)).toBe('text-orange-600')
    expect(getUtilizationColor(80)).toBe('text-orange-600')
    expect(getUtilizationColor(89)).toBe('text-orange-600')
  })

  it('should return yellow for 50-69%', () => {
    expect(getUtilizationColor(50)).toBe('text-yellow-600')
    expect(getUtilizationColor(60)).toBe('text-yellow-600')
    expect(getUtilizationColor(69)).toBe('text-yellow-600')
  })

  it('should return green for below 50%', () => {
    expect(getUtilizationColor(0)).toBe('text-green-600')
    expect(getUtilizationColor(25)).toBe('text-green-600')
    expect(getUtilizationColor(49)).toBe('text-green-600')
  })

  it('should handle edge cases at boundaries', () => {
    expect(getUtilizationColor(49.9)).toBe('text-green-600')
    expect(getUtilizationColor(69.9)).toBe('text-yellow-600')
    expect(getUtilizationColor(89.9)).toBe('text-orange-600')
  })
})
