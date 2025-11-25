import { describe, it, expect } from 'vitest'
import {
  TransactionType,
  createTransactionSchema,
  updateTransactionSchema,
  deleteTransactionSchema,
} from '@/lib/validations/transaction'

describe('TransactionType enum', () => {
  it('should include all transaction types', () => {
    expect(TransactionType.options).toEqual([
      'INCOME',
      'EXPENSE',
      'TRANSFER',
      'INTEREST_CHARGE',
      'LOAN_PAYMENT',
    ])
  })

  it('should validate valid transaction types', () => {
    expect(TransactionType.safeParse('INCOME').success).toBe(true)
    expect(TransactionType.safeParse('EXPENSE').success).toBe(true)
    expect(TransactionType.safeParse('TRANSFER').success).toBe(true)
    expect(TransactionType.safeParse('INTEREST_CHARGE').success).toBe(true)
    expect(TransactionType.safeParse('LOAN_PAYMENT').success).toBe(true)
  })

  it('should reject invalid transaction types', () => {
    expect(TransactionType.safeParse('INVALID').success).toBe(false)
    expect(TransactionType.safeParse('income').success).toBe(false) // case sensitive
    expect(TransactionType.safeParse('').success).toBe(false)
  })
})

describe('createTransactionSchema', () => {
  const validTransaction = {
    amount: 100.50,
    description: 'Test transaction',
    date: new Date('2024-11-15'),
    type: 'EXPENSE',
    notes: 'Test notes',
    isRecurring: false,
    accountId: 'account-123',
    categoryId: 'category-456',
    recurringId: null,
  }

  describe('amount validation', () => {
    it('should accept positive numbers', () => {
      const result = createTransactionSchema.safeParse(validTransaction)
      expect(result.success).toBe(true)
    })

    it('should accept string numbers and convert them', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        amount: '100.50',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.amount).toBe(100.50)
      }
    })

    it('should reject zero amount', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        amount: 0,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('positive')
      }
    })

    it('should reject negative amounts', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        amount: -100,
      })
      expect(result.success).toBe(false)
    })

    it('should handle decimal precision', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        amount: 99.99,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('description validation', () => {
    it('should accept valid descriptions', () => {
      const result = createTransactionSchema.safeParse(validTransaction)
      expect(result.success).toBe(true)
    })

    it('should accept empty/null descriptions', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        description: null,
      })
      expect(result.success).toBe(true)
    })

    it('should reject descriptions over 500 characters', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        description: 'a'.repeat(501),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('500')
      }
    })

    it('should accept descriptions at exactly 500 characters', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        description: 'a'.repeat(500),
      })
      expect(result.success).toBe(true)
    })
  })

  describe('date validation', () => {
    it('should accept Date objects', () => {
      const result = createTransactionSchema.safeParse(validTransaction)
      expect(result.success).toBe(true)
    })

    it('should accept date strings and convert them', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        date: '2024-11-15',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.date).toBeInstanceOf(Date)
      }
    })

    it('should accept ISO date strings', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        date: '2024-11-15T10:30:00.000Z',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid date strings', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        date: 'invalid-date',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('type validation', () => {
    it('should accept all valid transaction types', () => {
      const types = ['INCOME', 'EXPENSE', 'TRANSFER', 'INTEREST_CHARGE', 'LOAN_PAYMENT']

      types.forEach(type => {
        const result = createTransactionSchema.safeParse({
          ...validTransaction,
          type,
        })
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid types', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        type: 'INVALID',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('notes validation', () => {
    it('should accept valid notes', () => {
      const result = createTransactionSchema.safeParse(validTransaction)
      expect(result.success).toBe(true)
    })

    it('should accept null notes', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        notes: null,
      })
      expect(result.success).toBe(true)
    })

    it('should reject notes over 1000 characters', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        notes: 'a'.repeat(1001),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('1000')
      }
    })
  })

  describe('isRecurring validation', () => {
    it('should accept boolean true', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
      })
      expect(result.success).toBe(true)
    })

    it('should accept boolean false', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        isRecurring: false,
      })
      expect(result.success).toBe(true)
    })

    it('should default to false if not provided', () => {
      const { isRecurring, ...transactionWithoutRecurring } = validTransaction
      const result = createTransactionSchema.safeParse(transactionWithoutRecurring)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.isRecurring).toBe(false)
      }
    })
  })

  describe('accountId validation', () => {
    it('should accept valid account IDs', () => {
      const result = createTransactionSchema.safeParse(validTransaction)
      expect(result.success).toBe(true)
    })

    it('should reject empty account IDs', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        accountId: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('required')
      }
    })

    it('should reject missing account IDs', () => {
      const { accountId, ...transactionWithoutAccount } = validTransaction
      const result = createTransactionSchema.safeParse(transactionWithoutAccount)
      expect(result.success).toBe(false)
    })
  })

  describe('categoryId validation', () => {
    it('should accept valid category IDs', () => {
      const result = createTransactionSchema.safeParse(validTransaction)
      expect(result.success).toBe(true)
    })

    it('should accept null category IDs', () => {
      const result = createTransactionSchema.safeParse({
        ...validTransaction,
        categoryId: null,
      })
      expect(result.success).toBe(true)
    })

    it('should accept missing category IDs', () => {
      const { categoryId, ...transactionWithoutCategory } = validTransaction
      const result = createTransactionSchema.safeParse(transactionWithoutCategory)
      expect(result.success).toBe(true)
    })
  })
})

describe('updateTransactionSchema', () => {
  const validUpdate = {
    id: 'transaction-123',
    amount: 200.00,
    description: 'Updated transaction',
    date: new Date('2024-11-20'),
    type: 'INCOME' as const,
    notes: 'Updated notes',
    isRecurring: true,
    categoryId: 'category-789',
    recurringId: null,
  }

  it('should require id field', () => {
    const { id, ...updateWithoutId } = validUpdate
    const result = updateTransactionSchema.safeParse(updateWithoutId)
    expect(result.success).toBe(false)
  })

  it('should accept partial updates', () => {
    const result = updateTransactionSchema.safeParse({
      id: 'transaction-123',
      amount: 150.00,
    })
    expect(result.success).toBe(true)
  })

  it('should accept updates with only id', () => {
    const result = updateTransactionSchema.safeParse({
      id: 'transaction-123',
    })
    expect(result.success).toBe(true)
  })

  it('should validate amount if provided', () => {
    const result = updateTransactionSchema.safeParse({
      id: 'transaction-123',
      amount: -100,
    })
    expect(result.success).toBe(false)
  })

  it('should accept string amounts and convert them', () => {
    const result = updateTransactionSchema.safeParse({
      id: 'transaction-123',
      amount: '200.50',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.amount).toBe(200.50)
    }
  })

  it('should validate all fields if provided', () => {
    const result = updateTransactionSchema.safeParse(validUpdate)
    expect(result.success).toBe(true)
  })
})

describe('deleteTransactionSchema', () => {
  it('should accept valid id', () => {
    const result = deleteTransactionSchema.safeParse({
      id: 'transaction-123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty id', () => {
    const result = deleteTransactionSchema.safeParse({
      id: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing id', () => {
    const result = deleteTransactionSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
