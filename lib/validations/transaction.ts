import { z } from 'zod'

// Transaction type enum
export const TransactionType = z.enum([
  'INCOME',
  'EXPENSE',
  'TRANSFER',
  'INTEREST_CHARGE',
  'LOAN_PAYMENT',
])

export type TransactionType = z.infer<typeof TransactionType>

// Create transaction schema
export const createTransactionSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .or(z.string().transform((val) => parseFloat(val)))
    .pipe(z.number().positive('Amount must be positive')),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
  date: z
    .date()
    .or(z.string().transform((val) => new Date(val)))
    .pipe(z.date()),
  type: TransactionType,
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable(),
  isRecurring: z.boolean().default(false),
  accountId: z.string().min(1, 'Account ID is required'),
  categoryId: z.string().optional().nullable(),
  recurringId: z.string().optional().nullable(),
})

// Update transaction schema - all fields optional except id
export const updateTransactionSchema = z.object({
  id: z.string().min(1, 'Transaction ID is required'),
  amount: z
    .number()
    .positive('Amount must be positive')
    .or(z.string().transform((val) => parseFloat(val)))
    .pipe(z.number().positive('Amount must be positive'))
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
  date: z
    .date()
    .or(z.string().transform((val) => new Date(val)))
    .pipe(z.date())
    .optional(),
  type: TransactionType.optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable(),
  isRecurring: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  recurringId: z.string().optional().nullable(),
})

// Delete transaction schema
export const deleteTransactionSchema = z.object({
  id: z.string().min(1, 'Transaction ID is required'),
})

// Type exports
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type DeleteTransactionInput = z.infer<typeof deleteTransactionSchema>
