/**
 * Mock data for testing
 * Provides consistent test data across all test files
 *
 * Note: Using plain numbers instead of Prisma Decimal for test data
 * Tests can convert to Decimal if needed using the Decimal constructor
 */

export const mockUsers = {
  alice: {
    id: 'user-alice-123',
    email: 'alice@example.com',
    name: 'Alice Smith',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  bob: {
    id: 'user-bob-456',
    email: 'bob@example.com',
    name: 'Bob Johnson',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
}

export const mockAccounts = {
  checking: {
    id: 'account-checking-1',
    name: 'Main Checking',
    type: 'CHECKING',
    balance: 5000,
    currency: 'USD',
    creditLimit: null,
    apr: null,
    loanAmount: null,
    remainingBalance: null,
    loanTerm: null,
    monthlyPayment: null,
    userId: mockUsers.alice.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  savings: {
    id: 'account-savings-1',
    name: 'Emergency Fund',
    type: 'SAVINGS',
    balance: 10000,
    currency: 'USD',
    creditLimit: null,
    apr: null,
    loanAmount: null,
    remainingBalance: null,
    loanTerm: null,
    monthlyPayment: null,
    userId: mockUsers.alice.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  creditCard: {
    id: 'account-credit-1',
    name: 'Visa Card',
    type: 'CREDIT_CARD',
    balance: -2500,
    currency: 'USD',
    creditLimit: 10000,
    apr: 18.99,
    loanAmount: null,
    remainingBalance: null,
    loanTerm: null,
    monthlyPayment: null,
    userId: mockUsers.alice.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  loan: {
    id: 'account-loan-1',
    name: 'Car Loan',
    type: 'LOAN',
    balance: -15000,
    currency: 'USD',
    creditLimit: null,
    apr: 5.5,
    loanAmount: 25000,
    remainingBalance: 15000,
    loanTerm: 60,
    monthlyPayment: 450,
    userId: mockUsers.alice.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
}

export const mockCategories = {
  groceries: {
    id: 'category-groceries-1',
    name: 'Groceries',
    color: '#22c55e',
    icon: '🛒',
    userId: mockUsers.alice.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  dining: {
    id: 'category-dining-1',
    name: 'Dining Out',
    color: '#f59e0b',
    icon: '🍽️',
    userId: mockUsers.alice.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  utilities: {
    id: 'category-utilities-1',
    name: 'Utilities',
    color: '#3b82f6',
    icon: '⚡',
    userId: mockUsers.alice.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  salary: {
    id: 'category-salary-1',
    name: 'Salary',
    color: '#10b981',
    icon: '💰',
    userId: mockUsers.alice.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
}

export const mockTransactions = {
  groceries1: {
    id: 'transaction-1',
    amount: 125.50,
    description: 'Weekly groceries',
    date: new Date('2024-11-01'),
    type: 'EXPENSE',
    notes: null,
    isRecurring: false,
    accountId: mockAccounts.checking.id,
    categoryId: mockCategories.groceries.id,
    userId: mockUsers.alice.id,
    recurringId: null,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
  salary: {
    id: 'transaction-2',
    amount: 5000,
    description: 'Monthly salary',
    date: new Date('2024-11-01'),
    type: 'INCOME',
    notes: null,
    isRecurring: true,
    accountId: mockAccounts.checking.id,
    categoryId: mockCategories.salary.id,
    userId: mockUsers.alice.id,
    recurringId: null,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
  dining1: {
    id: 'transaction-3',
    amount: 45.75,
    description: 'Dinner at restaurant',
    date: new Date('2024-11-15'),
    type: 'EXPENSE',
    notes: 'Date night',
    isRecurring: false,
    accountId: mockAccounts.creditCard.id,
    categoryId: mockCategories.dining.id,
    userId: mockUsers.alice.id,
    recurringId: null,
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
  },
  interest: {
    id: 'transaction-4',
    amount: 42.50,
    description: 'Credit card interest',
    date: new Date('2024-11-20'),
    type: 'INTEREST_CHARGE',
    notes: null,
    isRecurring: false,
    accountId: mockAccounts.creditCard.id,
    categoryId: null,
    userId: mockUsers.alice.id,
    recurringId: null,
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-20'),
  },
  loanPayment: {
    id: 'transaction-5',
    amount: 450,
    description: 'Car loan payment',
    date: new Date('2024-11-01'),
    type: 'LOAN_PAYMENT',
    notes: null,
    isRecurring: true,
    accountId: mockAccounts.loan.id,
    categoryId: null,
    userId: mockUsers.alice.id,
    recurringId: null,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
}

export const mockRecurringCharges = {
  netflix: {
    id: 'recurring-1',
    name: 'Netflix',
    amount: 15.99,
    frequency: 'monthly',
    nextDueDate: new Date('2024-12-01'),
    accountId: mockAccounts.creditCard.id,
    categoryId: mockCategories.utilities.id,
    userId: mockUsers.alice.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  spotify: {
    id: 'recurring-2',
    name: 'Spotify',
    amount: 10.99,
    frequency: 'monthly',
    nextDueDate: new Date('2024-12-05'),
    accountId: mockAccounts.creditCard.id,
    categoryId: mockCategories.utilities.id,
    userId: mockUsers.alice.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
}

export const mockBudgets = {
  groceriesBudget: {
    id: 'budget-1',
    amount: 500,
    period: 'monthly',
    categoryId: mockCategories.groceries.id,
    userId: mockUsers.alice.id,
    startDate: new Date('2024-11-01'),
    endDate: null,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
  diningBudget: {
    id: 'budget-2',
    amount: 300,
    period: 'monthly',
    categoryId: mockCategories.dining.id,
    userId: mockUsers.alice.id,
    startDate: new Date('2024-11-01'),
    endDate: null,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
}

/**
 * Helper function to create a transaction with custom overrides
 */
export function createMockTransaction(overrides: any = {}) {
  return {
    id: `transaction-${Date.now()}`,
    amount: 100,
    description: 'Test transaction',
    date: new Date(),
    type: 'EXPENSE',
    notes: null,
    isRecurring: false,
    accountId: mockAccounts.checking.id,
    categoryId: mockCategories.groceries.id,
    userId: mockUsers.alice.id,
    recurringId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

/**
 * Helper function to create an account with custom overrides
 */
export function createMockAccount(overrides: any = {}) {
  return {
    id: `account-${Date.now()}`,
    name: 'Test Account',
    type: 'CHECKING',
    balance: 1000,
    currency: 'USD',
    creditLimit: null,
    apr: null,
    loanAmount: null,
    remainingBalance: null,
    loanTerm: null,
    monthlyPayment: null,
    userId: mockUsers.alice.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

/**
 * Helper function to create a category with custom overrides
 */
export function createMockCategory(overrides: any = {}) {
  return {
    id: `category-${Date.now()}`,
    name: 'Test Category',
    color: '#000000',
    icon: '📁',
    userId: mockUsers.alice.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}
