import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createMockPrisma } from '@/__tests__/fixtures/mockPrisma'
import { mockTransactions, mockAccounts } from '@/__tests__/fixtures/mockData'

// Mock the Prisma client BEFORE importing modules that use it
vi.mock('@/lib/prisma', () => ({
  prisma: createMockPrisma(),
}))

import {
  getMonthDateRange,
  getPreviousMonth,
  calculatePercentageChange,
  getMonthlyExpenseMetrics,
  getExpenseMetricsWithComparison,
} from '@/lib/expenseUtils'
import { prisma } from '@/lib/prisma'

describe('getMonthDateRange', () => {
  it('should return start and end of month', () => {
    const date = new Date('2024-11-15')
    const { start, end } = getMonthDateRange(date)

    expect(start.getFullYear()).toBe(2024)
    expect(start.getMonth()).toBe(10) // November is month 10 (0-indexed)
    expect(start.getDate()).toBe(1)
    expect(start.getHours()).toBe(0)
    expect(start.getMinutes()).toBe(0)

    expect(end.getFullYear()).toBe(2024)
    expect(end.getMonth()).toBe(10)
    expect(end.getDate()).toBe(30) // November has 30 days
    expect(end.getHours()).toBe(23)
    expect(end.getMinutes()).toBe(59)
    expect(end.getSeconds()).toBe(59)
  })

  it('should handle January', () => {
    const date = new Date('2024-01-15')
    const { start, end } = getMonthDateRange(date)

    expect(start.getDate()).toBe(1)
    expect(end.getDate()).toBe(31) // January has 31 days
  })

  it('should handle February in leap year', () => {
    const date = new Date('2024-02-15')
    const { start, end } = getMonthDateRange(date)

    expect(start.getDate()).toBe(1)
    expect(end.getDate()).toBe(29) // 2024 is a leap year
  })

  it('should handle February in non-leap year', () => {
    const date = new Date('2023-02-15')
    const { start, end } = getMonthDateRange(date)

    expect(start.getDate()).toBe(1)
    expect(end.getDate()).toBe(28) // 2023 is not a leap year
  })

  it('should handle December', () => {
    const date = new Date('2024-12-15')
    const { start, end } = getMonthDateRange(date)

    expect(start.getDate()).toBe(1)
    expect(end.getDate()).toBe(31) // December has 31 days
  })
})

describe('getPreviousMonth', () => {
  it('should return previous month in same year', () => {
    const date = new Date('2024-11-15')
    const prev = getPreviousMonth(date)

    expect(prev.getFullYear()).toBe(2024)
    expect(prev.getMonth()).toBe(9) // October (0-indexed)
  })

  it('should handle January (go to previous year)', () => {
    const date = new Date('2024-01-15')
    const prev = getPreviousMonth(date)

    expect(prev.getFullYear()).toBe(2023)
    expect(prev.getMonth()).toBe(11) // December
  })

  it('should preserve day and time', () => {
    const date = new Date('2024-11-15T10:30:00')
    const prev = getPreviousMonth(date)

    expect(prev.getDate()).toBe(15)
    expect(prev.getHours()).toBe(10)
    expect(prev.getMinutes()).toBe(30)
  })
})

describe('calculatePercentageChange', () => {
  it('should calculate positive percentage change', () => {
    expect(calculatePercentageChange(150, 100)).toBe(50)
  })

  it('should calculate negative percentage change', () => {
    expect(calculatePercentageChange(50, 100)).toBe(-50)
  })

  it('should handle no change', () => {
    expect(calculatePercentageChange(100, 100)).toBe(0)
  })

  it('should handle zero previous value with positive current', () => {
    expect(calculatePercentageChange(100, 0)).toBe(100)
  })

  it('should handle zero previous value with zero current', () => {
    expect(calculatePercentageChange(0, 0)).toBe(0)
  })

  it('should handle decimal values', () => {
    const change = calculatePercentageChange(125.50, 100)
    expect(change).toBeCloseTo(25.5, 1)
  })

  it('should calculate large percentage increases', () => {
    expect(calculatePercentageChange(300, 100)).toBe(200)
  })

  it('should calculate small percentage changes', () => {
    const change = calculatePercentageChange(101, 100)
    expect(change).toBeCloseTo(1, 2)
  })
})

describe('getMonthlyExpenseMetrics', () => {
  const mockPrisma = prisma as ReturnType<typeof createMockPrisma>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should calculate total expenses correctly', async () => {
    const transactions = [
      {
        ...mockTransactions.groceries1,
        amount: 100,
        type: 'EXPENSE',
        account: mockAccounts.checking,
      },
      {
        ...mockTransactions.dining1,
        amount: 50,
        type: 'EXPENSE',
        account: mockAccounts.checking,
      },
      {
        ...mockTransactions.salary,
        amount: 5000,
        type: 'INCOME',
        account: mockAccounts.checking,
      },
    ]

    vi.mocked(mockPrisma.transaction.findMany).mockResolvedValue(transactions as any)

    const metrics = await getMonthlyExpenseMetrics('user-123', new Date('2024-11-15'))

    expect(metrics.totalExpenses).toBe(150) // 100 + 50
  })

  it('should calculate interest paid from INTEREST_CHARGE transactions', async () => {
    const transactions = [
      {
        ...mockTransactions.interest,
        amount: 42.50,
        type: 'INTEREST_CHARGE',
        account: mockAccounts.creditCard,
      },
      {
        ...mockTransactions.groceries1,
        amount: 100,
        type: 'EXPENSE',
        account: mockAccounts.checking,
      },
    ]

    vi.mocked(mockPrisma.transaction.findMany).mockResolvedValue(transactions as any)

    const metrics = await getMonthlyExpenseMetrics('user-123', new Date('2024-11-15'))

    expect(metrics.interestPaid).toBe(42.50)
  })

  it('should calculate recurring charges', async () => {
    const transactions = [
      {
        ...mockTransactions.groceries1,
        amount: 100,
        type: 'EXPENSE',
        isRecurring: true,
        account: mockAccounts.checking,
      },
      {
        ...mockTransactions.dining1,
        amount: 50,
        type: 'EXPENSE',
        isRecurring: true,
        account: mockAccounts.checking,
      },
      {
        ...mockTransactions.groceries1,
        amount: 25,
        type: 'EXPENSE',
        isRecurring: false,
        account: mockAccounts.checking,
      },
    ]

    vi.mocked(mockPrisma.transaction.findMany).mockResolvedValue(transactions as any)

    const metrics = await getMonthlyExpenseMetrics('user-123', new Date('2024-11-15'))

    expect(metrics.recurringCharges).toBe(150) // Only recurring expenses
  })

  it('should calculate credit card spending', async () => {
    const transactions = [
      {
        ...mockTransactions.dining1,
        amount: 100,
        type: 'EXPENSE',
        account: { ...mockAccounts.creditCard, type: 'CREDIT_CARD' },
      },
      {
        ...mockTransactions.groceries1,
        amount: 50,
        type: 'EXPENSE',
        account: { ...mockAccounts.checking, type: 'CHECKING' },
      },
    ]

    vi.mocked(mockPrisma.transaction.findMany).mockResolvedValue(transactions as any)

    const metrics = await getMonthlyExpenseMetrics('user-123', new Date('2024-11-15'))

    expect(metrics.creditCardSpending).toBe(100) // Only credit card expenses
  })

  it('should calculate loan payments', async () => {
    const transactions = [
      {
        ...mockTransactions.loanPayment,
        amount: 450,
        type: 'LOAN_PAYMENT',
        account: { ...mockAccounts.loan, type: 'LOAN' },
      },
      {
        ...mockTransactions.groceries1,
        amount: 100,
        type: 'EXPENSE',
        account: { ...mockAccounts.checking, type: 'CHECKING' },
      },
    ]

    vi.mocked(mockPrisma.transaction.findMany).mockResolvedValue(transactions as any)

    const metrics = await getMonthlyExpenseMetrics('user-123', new Date('2024-11-15'))

    expect(metrics.loanPayments).toBe(450)
  })

  it('should handle no transactions', async () => {
    vi.mocked(mockPrisma.transaction.findMany).mockResolvedValue([])

    const metrics = await getMonthlyExpenseMetrics('user-123', new Date('2024-11-15'))

    expect(metrics.totalExpenses).toBe(0)
    expect(metrics.interestPaid).toBe(0)
    expect(metrics.recurringCharges).toBe(0)
    expect(metrics.creditCardSpending).toBe(0)
    expect(metrics.loanPayments).toBe(0)
  })

  it('should query correct date range', async () => {
    vi.mocked(mockPrisma.transaction.findMany).mockResolvedValue([])

    await getMonthlyExpenseMetrics('user-123', new Date('2024-11-15'))

    expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-123',
        date: {
          gte: expect.any(Date),
          lte: expect.any(Date),
        },
      },
      include: {
        account: true,
      },
    })

    const call = vi.mocked(mockPrisma.transaction.findMany).mock.calls[0][0]
    const startDate = call?.where?.date?.gte
    const endDate = call?.where?.date?.lte

    expect(startDate).toBeInstanceOf(Date)
    expect(endDate).toBeInstanceOf(Date)
    expect((startDate as Date).getDate()).toBe(1) // First day of month
    expect((endDate as Date).getDate()).toBe(30) // Last day of November
  })
})

describe('getExpenseMetricsWithComparison', () => {
  const mockPrisma = prisma as ReturnType<typeof createMockPrisma>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return metrics with percentage changes', async () => {
    // Current month transactions
    const currentTransactions = [
      {
        ...mockTransactions.groceries1,
        amount: 150,
        type: 'EXPENSE',
        account: mockAccounts.checking,
      },
    ]

    // Previous month transactions
    const previousTransactions = [
      {
        ...mockTransactions.groceries1,
        amount: 100,
        type: 'EXPENSE',
        account: mockAccounts.checking,
      },
    ]

    vi.mocked(mockPrisma.transaction.findMany)
      .mockResolvedValueOnce(currentTransactions as any) // First call for current month
      .mockResolvedValueOnce(previousTransactions as any) // Second call for previous month

    const comparison = await getExpenseMetricsWithComparison(
      'user-123',
      new Date('2024-11-15')
    )

    expect(comparison.totalExpenses).toBe(150)
    expect(comparison.totalExpensesChange).toBe(50) // 50% increase
  })

  it('should handle zero previous expenses', async () => {
    const currentTransactions = [
      {
        ...mockTransactions.groceries1,
        amount: 100,
        type: 'EXPENSE',
        account: mockAccounts.checking,
      },
    ]

    vi.mocked(mockPrisma.transaction.findMany)
      .mockResolvedValueOnce(currentTransactions as any)
      .mockResolvedValueOnce([]) // No previous transactions

    const comparison = await getExpenseMetricsWithComparison(
      'user-123',
      new Date('2024-11-15')
    )

    expect(comparison.totalExpenses).toBe(100)
    expect(comparison.totalExpensesChange).toBe(100) // 100% increase from 0
  })

  it('should calculate all metric changes', async () => {
    const currentTransactions = [
      {
        ...mockTransactions.groceries1,
        amount: 200,
        type: 'EXPENSE',
        isRecurring: true,
        account: { ...mockAccounts.creditCard, type: 'CREDIT_CARD' },
      },
      {
        ...mockTransactions.interest,
        amount: 50,
        type: 'INTEREST_CHARGE',
        account: mockAccounts.creditCard,
      },
      {
        ...mockTransactions.loanPayment,
        amount: 500,
        type: 'LOAN_PAYMENT',
        account: { ...mockAccounts.loan, type: 'LOAN' },
      },
    ]

    const previousTransactions = [
      {
        ...mockTransactions.groceries1,
        amount: 100,
        type: 'EXPENSE',
        isRecurring: true,
        account: { ...mockAccounts.creditCard, type: 'CREDIT_CARD' },
      },
      {
        ...mockTransactions.interest,
        amount: 40,
        type: 'INTEREST_CHARGE',
        account: mockAccounts.creditCard,
      },
      {
        ...mockTransactions.loanPayment,
        amount: 500,
        type: 'LOAN_PAYMENT',
        account: { ...mockAccounts.loan, type: 'LOAN' },
      },
    ]

    vi.mocked(mockPrisma.transaction.findMany)
      .mockResolvedValueOnce(currentTransactions as any)
      .mockResolvedValueOnce(previousTransactions as any)

    const comparison = await getExpenseMetricsWithComparison(
      'user-123',
      new Date('2024-11-15')
    )

    expect(comparison.totalExpensesChange).toBe(100) // 100% increase (100 -> 200)
    expect(comparison.interestPaidChange).toBe(25) // 25% increase (40 -> 50)
    expect(comparison.recurringChargesChange).toBe(100) // 100% increase (100 -> 200)
    expect(comparison.creditCardSpendingChange).toBe(100) // 100% increase (100 -> 200)
    expect(comparison.loanPaymentsChange).toBe(0) // No change (500 -> 500)
  })

  it('should use current month by default', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-11-15T10:30:00'))

    vi.mocked(mockPrisma.transaction.findMany)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])

    await getExpenseMetricsWithComparison('user-123')

    // Should be called twice (current + previous month)
    expect(mockPrisma.transaction.findMany).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })
})
