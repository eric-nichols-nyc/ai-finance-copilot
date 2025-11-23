import { z } from 'zod'

// Account type enum
export const AccountType = z.enum([
  'CREDIT_CARD',
  'LOAN',
  'CHECKING',
  'SAVINGS',
])

export type AccountType = z.infer<typeof AccountType>

// Base account schema with common fields
const baseAccountSchema = z.object({
  name: z
    .string()
    .min(1, 'Account name is required')
    .max(100, 'Account name must be less than 100 characters'),
  type: AccountType,
  balance: z
    .number()
    .or(z.string().transform((val) => parseFloat(val)))
    .pipe(z.number().finite('Balance must be a valid number')),
  currency: z.string().default('USD'),
})

// Credit card specific fields
const creditCardFields = z.object({
  creditLimit: z
    .number()
    .positive('Credit limit must be positive')
    .or(z.string().transform((val) => parseFloat(val)))
    .pipe(z.number().positive('Credit limit must be positive')),
  apr: z
    .number()
    .min(0, 'APR must be 0 or greater')
    .max(100, 'APR must be 100 or less')
    .or(z.string().transform((val) => parseFloat(val)))
    .pipe(
      z.number().min(0, 'APR must be 0 or greater').max(100, 'APR must be 100 or less')
    ),
})

// Loan specific fields
const loanFields = z.object({
  loanAmount: z
    .number()
    .positive('Loan amount must be positive')
    .or(z.string().transform((val) => parseFloat(val)))
    .pipe(z.number().positive('Loan amount must be positive')),
  remainingBalance: z
    .number()
    .min(0, 'Remaining balance must be 0 or greater')
    .or(z.string().transform((val) => parseFloat(val)))
    .pipe(z.number().min(0, 'Remaining balance must be 0 or greater')),
  loanTerm: z
    .number()
    .int('Loan term must be a whole number')
    .positive('Loan term must be positive')
    .or(z.string().transform((val) => parseInt(val)))
    .pipe(
      z
        .number()
        .int('Loan term must be a whole number')
        .positive('Loan term must be positive')
    ),
  monthlyPayment: z
    .number()
    .positive('Monthly payment must be positive')
    .or(z.string().transform((val) => parseFloat(val)))
    .pipe(z.number().positive('Monthly payment must be positive')),
  apr: z
    .number()
    .min(0, 'APR must be 0 or greater')
    .max(100, 'APR must be 100 or less')
    .or(z.string().transform((val) => parseFloat(val)))
    .pipe(
      z.number().min(0, 'APR must be 0 or greater').max(100, 'APR must be 100 or less')
    )
    .optional(),
})

// Create account schema - discriminated union based on type
export const createAccountSchema = z.discriminatedUnion('type', [
  // Credit Card
  baseAccountSchema.merge(
    z.object({
      type: z.literal('CREDIT_CARD'),
    })
  ).merge(creditCardFields),

  // Loan
  baseAccountSchema.merge(
    z.object({
      type: z.literal('LOAN'),
    })
  ).merge(loanFields),

  // Checking or Savings - no extra fields required
  baseAccountSchema.merge(
    z.object({
      type: z.enum(['CHECKING', 'SAVINGS']),
    })
  ),
])

// Update account schema - all fields optional except id
export const updateAccountSchema = z.discriminatedUnion('type', [
  // Credit Card
  baseAccountSchema.partial().merge(
    z.object({
      id: z.string().min(1, 'Account ID is required'),
      type: z.literal('CREDIT_CARD'),
    })
  ).merge(creditCardFields.partial()),

  // Loan
  baseAccountSchema.partial().merge(
    z.object({
      id: z.string().min(1, 'Account ID is required'),
      type: z.literal('LOAN'),
    })
  ).merge(loanFields.partial()),

  // Checking or Savings
  baseAccountSchema.partial().merge(
    z.object({
      id: z.string().min(1, 'Account ID is required'),
      type: z.enum(['CHECKING', 'SAVINGS']),
    })
  ),
])

// Delete account schema
export const deleteAccountSchema = z.object({
  id: z.string().min(1, 'Account ID is required'),
})

// Type exports
export type CreateAccountInput = z.infer<typeof createAccountSchema>
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>
