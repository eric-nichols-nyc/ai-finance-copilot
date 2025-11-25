import { describe, it, expect } from 'vitest'
import {
  AccountType,
  createAccountSchema,
  updateAccountSchema,
  deleteAccountSchema,
} from '@/lib/validations/account'

describe('AccountType enum', () => {
  it('should include all account types', () => {
    expect(AccountType.options).toEqual([
      'CREDIT_CARD',
      'LOAN',
      'CHECKING',
      'SAVINGS',
    ])
  })

  it('should validate valid account types', () => {
    expect(AccountType.safeParse('CREDIT_CARD').success).toBe(true)
    expect(AccountType.safeParse('LOAN').success).toBe(true)
    expect(AccountType.safeParse('CHECKING').success).toBe(true)
    expect(AccountType.safeParse('SAVINGS').success).toBe(true)
  })

  it('should reject invalid account types', () => {
    expect(AccountType.safeParse('INVALID').success).toBe(false)
    expect(AccountType.safeParse('checking').success).toBe(false) // case sensitive
    expect(AccountType.safeParse('').success).toBe(false)
  })
})

describe('createAccountSchema - CHECKING account', () => {
  const validCheckingAccount = {
    name: 'Main Checking',
    type: 'CHECKING' as const,
    balance: 1000,
    currency: 'USD',
  }

  it('should accept valid checking account', () => {
    const result = createAccountSchema.safeParse(validCheckingAccount)
    expect(result.success).toBe(true)
  })

  it('should accept negative balance', () => {
    const result = createAccountSchema.safeParse({
      ...validCheckingAccount,
      balance: -100,
    })
    expect(result.success).toBe(true)
  })

  it('should accept zero balance', () => {
    const result = createAccountSchema.safeParse({
      ...validCheckingAccount,
      balance: 0,
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty name', () => {
    const result = createAccountSchema.safeParse({
      ...validCheckingAccount,
      name: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject name over 100 characters', () => {
    const result = createAccountSchema.safeParse({
      ...validCheckingAccount,
      name: 'a'.repeat(101),
    })
    expect(result.success).toBe(false)
  })

  it('should convert string balance to number', () => {
    const result = createAccountSchema.safeParse({
      ...validCheckingAccount,
      balance: '1000.50',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.balance).toBe(1000.50)
    }
  })
})

describe('createAccountSchema - SAVINGS account', () => {
  const validSavingsAccount = {
    name: 'Emergency Fund',
    type: 'SAVINGS' as const,
    balance: 5000,
    currency: 'USD',
  }

  it('should accept valid savings account', () => {
    const result = createAccountSchema.safeParse(validSavingsAccount)
    expect(result.success).toBe(true)
  })

  it('should not require extra fields for savings', () => {
    const result = createAccountSchema.safeParse(validSavingsAccount)
    expect(result.success).toBe(true)
  })
})

describe('createAccountSchema - CREDIT_CARD account', () => {
  const validCreditCard = {
    name: 'Visa Card',
    type: 'CREDIT_CARD' as const,
    balance: -2500,
    currency: 'USD',
    creditLimit: 10000,
    apr: 18.99,
  }

  it('should accept valid credit card', () => {
    const result = createAccountSchema.safeParse(validCreditCard)
    expect(result.success).toBe(true)
  })

  it('should require creditLimit for credit card', () => {
    const { creditLimit, ...cardWithoutLimit } = validCreditCard
    const result = createAccountSchema.safeParse(cardWithoutLimit)
    expect(result.success).toBe(false)
  })

  it('should require apr for credit card', () => {
    const { apr, ...cardWithoutApr } = validCreditCard
    const result = createAccountSchema.safeParse(cardWithoutApr)
    expect(result.success).toBe(false)
  })

  it('should reject negative creditLimit', () => {
    const result = createAccountSchema.safeParse({
      ...validCreditCard,
      creditLimit: -1000,
    })
    expect(result.success).toBe(false)
  })

  it('should reject zero creditLimit', () => {
    const result = createAccountSchema.safeParse({
      ...validCreditCard,
      creditLimit: 0,
    })
    expect(result.success).toBe(false)
  })

  it('should accept string creditLimit and convert', () => {
    const result = createAccountSchema.safeParse({
      ...validCreditCard,
      creditLimit: '10000',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.creditLimit).toBe(10000)
    }
  })

  it('should reject negative APR', () => {
    const result = createAccountSchema.safeParse({
      ...validCreditCard,
      apr: -5,
    })
    expect(result.success).toBe(false)
  })

  it('should accept 0% APR', () => {
    const result = createAccountSchema.safeParse({
      ...validCreditCard,
      apr: 0,
    })
    expect(result.success).toBe(true)
  })

  it('should reject APR over 100', () => {
    const result = createAccountSchema.safeParse({
      ...validCreditCard,
      apr: 101,
    })
    expect(result.success).toBe(false)
  })

  it('should accept APR at exactly 100', () => {
    const result = createAccountSchema.safeParse({
      ...validCreditCard,
      apr: 100,
    })
    expect(result.success).toBe(true)
  })

  it('should convert string APR to number', () => {
    const result = createAccountSchema.safeParse({
      ...validCreditCard,
      apr: '18.99',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.apr).toBe(18.99)
    }
  })
})

describe('createAccountSchema - LOAN account', () => {
  const validLoan = {
    name: 'Car Loan',
    type: 'LOAN' as const,
    balance: -15000,
    currency: 'USD',
    loanAmount: 25000,
    remainingBalance: 15000,
    loanTerm: 60,
    monthlyPayment: 450,
    apr: 5.5,
  }

  it('should accept valid loan', () => {
    const result = createAccountSchema.safeParse(validLoan)
    expect(result.success).toBe(true)
  })

  it('should require loanAmount', () => {
    const { loanAmount, ...loanWithoutAmount } = validLoan
    const result = createAccountSchema.safeParse(loanWithoutAmount)
    expect(result.success).toBe(false)
  })

  it('should require remainingBalance', () => {
    const { remainingBalance, ...loanWithoutRemaining } = validLoan
    const result = createAccountSchema.safeParse(loanWithoutRemaining)
    expect(result.success).toBe(false)
  })

  it('should require loanTerm', () => {
    const { loanTerm, ...loanWithoutTerm } = validLoan
    const result = createAccountSchema.safeParse(loanWithoutTerm)
    expect(result.success).toBe(false)
  })

  it('should require monthlyPayment', () => {
    const { monthlyPayment, ...loanWithoutPayment } = validLoan
    const result = createAccountSchema.safeParse(loanWithoutPayment)
    expect(result.success).toBe(false)
  })

  it('should accept loan without APR', () => {
    const { apr, ...loanWithoutApr } = validLoan
    const result = createAccountSchema.safeParse(loanWithoutApr)
    expect(result.success).toBe(true)
  })

  it('should reject negative loanAmount', () => {
    const result = createAccountSchema.safeParse({
      ...validLoan,
      loanAmount: -1000,
    })
    expect(result.success).toBe(false)
  })

  it('should reject negative remainingBalance', () => {
    const result = createAccountSchema.safeParse({
      ...validLoan,
      remainingBalance: -100,
    })
    expect(result.success).toBe(false)
  })

  it('should accept zero remainingBalance (paid off)', () => {
    const result = createAccountSchema.safeParse({
      ...validLoan,
      remainingBalance: 0,
    })
    expect(result.success).toBe(true)
  })

  it('should reject decimal loanTerm', () => {
    const result = createAccountSchema.safeParse({
      ...validLoan,
      loanTerm: 60.5,
    })
    expect(result.success).toBe(false)
  })

  it('should convert string loanTerm to integer', () => {
    const result = createAccountSchema.safeParse({
      ...validLoan,
      loanTerm: '60',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.loanTerm).toBe(60)
    }
  })

  it('should reject negative monthlyPayment', () => {
    const result = createAccountSchema.safeParse({
      ...validLoan,
      monthlyPayment: -100,
    })
    expect(result.success).toBe(false)
  })

  it('should convert string values to numbers', () => {
    const result = createAccountSchema.safeParse({
      ...validLoan,
      loanAmount: '25000',
      remainingBalance: '15000',
      loanTerm: '60',
      monthlyPayment: '450',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.loanAmount).toBe(25000)
      expect(result.data.remainingBalance).toBe(15000)
      expect(result.data.loanTerm).toBe(60)
      expect(result.data.monthlyPayment).toBe(450)
    }
  })
})

describe('updateAccountSchema', () => {
  it('should require id field for checking account', () => {
    const result = updateAccountSchema.safeParse({
      name: 'Updated Checking',
      type: 'CHECKING',
    })
    expect(result.success).toBe(false)
  })

  it('should accept partial updates for checking', () => {
    const result = updateAccountSchema.safeParse({
      id: 'account-123',
      type: 'CHECKING',
      name: 'Updated Name',
    })
    expect(result.success).toBe(true)
  })

  it('should accept partial updates for credit card', () => {
    const result = updateAccountSchema.safeParse({
      id: 'account-123',
      type: 'CREDIT_CARD',
      creditLimit: 15000,
    })
    expect(result.success).toBe(true)
  })

  it('should accept partial updates for loan', () => {
    const result = updateAccountSchema.safeParse({
      id: 'account-123',
      type: 'LOAN',
      remainingBalance: 10000,
    })
    expect(result.success).toBe(true)
  })

  it('should validate credit card fields if provided', () => {
    const result = updateAccountSchema.safeParse({
      id: 'account-123',
      type: 'CREDIT_CARD',
      apr: -5, // invalid
    })
    expect(result.success).toBe(false)
  })

  it('should validate loan fields if provided', () => {
    const result = updateAccountSchema.safeParse({
      id: 'account-123',
      type: 'LOAN',
      loanTerm: -12, // invalid
    })
    expect(result.success).toBe(false)
  })
})

describe('deleteAccountSchema', () => {
  it('should accept valid id', () => {
    const result = deleteAccountSchema.safeParse({
      id: 'account-123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty id', () => {
    const result = deleteAccountSchema.safeParse({
      id: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing id', () => {
    const result = deleteAccountSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
