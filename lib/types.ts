// Account Types
export const AccountType = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
  CREDIT_CARD: 'CREDIT_CARD',
  LOAN: 'LOAN',
  INVESTMENT: 'INVESTMENT',
} as const

export type AccountType = typeof AccountType[keyof typeof AccountType]

// Transaction Types
export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  TRANSFER: 'TRANSFER',
  INTEREST_CHARGE: 'INTEREST_CHARGE',
  LOAN_PAYMENT: 'LOAN_PAYMENT',
} as const

export type TransactionType = typeof TransactionType[keyof typeof TransactionType]

// Expense Metrics for Monthly Spending Card
export interface ExpenseMetrics {
  totalExpenses: number
  interestPaid: number
  recurringCharges: number
  creditCardSpending: number
  loanPayments: number
}

export interface ExpenseMetricsComparison extends ExpenseMetrics {
  totalExpensesChange: number
  interestPaidChange: number
  recurringChargesChange: number
  creditCardSpendingChange: number
  loanPaymentsChange: number
}
