/**
 * Mock Prisma client for testing
 * Use this to mock database calls in unit and integration tests
 */

import { vi } from 'vitest'
import type { PrismaClient } from '@/app/generated/prisma'

/**
 * Create a mock Prisma client with default implementations
 * You can override specific methods in your tests as needed
 */
export function createMockPrisma() {
  return {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    account: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    transaction: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },
    category: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    budget: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    recurringCharge: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    interestPayment: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    accountBalanceSnapshot: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  } as unknown as PrismaClient
}

/**
 * Mock the Prisma module
 * Use this in your test setup to replace the real Prisma client
 *
 * @example
 * ```typescript
 * import { vi } from 'vitest'
 * import { createMockPrisma } from '@/__tests__/fixtures/mockPrisma'
 *
 * vi.mock('@/lib/prisma', () => ({
 *   prisma: createMockPrisma()
 * }))
 * ```
 */
export function mockPrismaModule() {
  return {
    prisma: createMockPrisma(),
  }
}

/**
 * Helper to reset all mocks on the Prisma client
 */
export function resetMockPrisma(mockPrisma: ReturnType<typeof createMockPrisma>) {
  Object.values(mockPrisma).forEach((model: any) => {
    if (typeof model === 'object') {
      Object.values(model).forEach((method: any) => {
        if (typeof method?.mockClear === 'function') {
          method.mockClear()
        }
      })
    }
  })
}
