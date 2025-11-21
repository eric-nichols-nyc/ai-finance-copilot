export type User = {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type Account = {
  id: string
  name: string
  type: string // 'CREDIT_CARD' | 'BANK_ACCOUNT'
  balance: number
  creditLimit: number | null
  apr: number | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type Category = {
  id: string
  name: string
  color: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type Transaction = {
  id: string
  name: string
  amount: number
  type: string // 'INCOME' | 'EXPENSE'
  date: Date
  notes: string | null
  isRecurring: boolean
  accountId: string
  categoryId: string
  userId: string
  recurringId: string | null
  createdAt: Date
  updatedAt: Date
  account?: Account
  category?: Category
}

export type RecurringCharge = {
  id: string
  name: string
  amount: number
  frequency: string // 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  nextDueDate: Date
  accountId: string
  categoryId: string
  userId: string
  createdAt: Date
  updatedAt: Date
  account?: Account
  category?: Category
}

export type CategorySpending = {
  category: Category
  total: number
  count: number
}

export type MonthlyStats = {
  income: number
  expenses: number
  netIncome: number
  transactionCount: number
}
