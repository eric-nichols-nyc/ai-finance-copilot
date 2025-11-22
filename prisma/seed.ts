import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

// Type constants for SQLite (since enums aren't supported)
const AccountType = {
  CREDIT_CARD: 'CREDIT_CARD',
  BANK_ACCOUNT: 'BANK_ACCOUNT',
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
  LOAN: 'LOAN'
} as const

const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE'
} as const

const RecurringFrequency = {
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  YEARLY: 'YEARLY'
} as const

async function main() {
  console.log('🌱 Starting database seed...')

  // Create example user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  })

  console.log('✅ Created user:', user.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Groceries' } },
      update: {},
      create: { name: 'Groceries', color: '#10b981', userId: user.id },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Dining' } },
      update: {},
      create: { name: 'Dining', color: '#f59e0b', userId: user.id },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Entertainment' } },
      update: {},
      create: { name: 'Entertainment', color: '#8b5cf6', userId: user.id },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Transportation' } },
      update: {},
      create: { name: 'Transportation', color: '#3b82f6', userId: user.id },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Utilities' } },
      update: {},
      create: { name: 'Utilities', color: '#06b6d4', userId: user.id },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Shopping' } },
      update: {},
      create: { name: 'Shopping', color: '#ec4899', userId: user.id },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Healthcare' } },
      update: {},
      create: { name: 'Healthcare', color: '#ef4444', userId: user.id },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Salary' } },
      update: {},
      create: { name: 'Salary', color: '#22c55e', userId: user.id },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Freelance' } },
      update: {},
      create: { name: 'Freelance', color: '#84cc16', userId: user.id },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Subscription' } },
      update: {},
      create: { name: 'Subscription', color: '#a855f7', userId: user.id },
    }),
  ])

  console.log('✅ Created categories:', categories.length)

  // Create accounts
  const checkingAccount = await prisma.account.create({
    data: {
      name: 'Chase Checking',
      type: AccountType.CHECKING,
      balance: 5420.50,
      userId: user.id,
    },
  })

  const savingsAccount = await prisma.account.create({
    data: {
      name: 'Marcus Savings',
      type: AccountType.SAVINGS,
      balance: 15000.00,
      userId: user.id,
    },
  })

  const creditCard1 = await prisma.account.create({
    data: {
      name: 'Chase Sapphire Reserve',
      type: AccountType.CREDIT_CARD,
      balance: 2845.67,
      creditLimit: 10000,
      apr: 19.99,
      userId: user.id,
    },
  })

  const creditCard2 = await prisma.account.create({
    data: {
      name: 'American Express Gold',
      type: AccountType.CREDIT_CARD,
      balance: 1234.89,
      creditLimit: 5000,
      apr: 21.99,
      userId: user.id,
    },
  })

  const creditCard3 = await prisma.account.create({
    data: {
      name: 'Capital One Quicksilver',
      type: AccountType.CREDIT_CARD,
      balance: 567.23,
      creditLimit: 3000,
      apr: 18.49,
      userId: user.id,
    },
  })

  const creditCard4 = await prisma.account.create({
    data: {
      name: 'Discover It',
      type: AccountType.CREDIT_CARD,
      balance: 892.45,
      creditLimit: 4000,
      apr: 20.24,
      userId: user.id,
    },
  })

  const creditCard5 = await prisma.account.create({
    data: {
      name: 'Citi Double Cash',
      type: AccountType.CREDIT_CARD,
      balance: 1567.89,
      creditLimit: 7500,
      apr: 17.99,
      userId: user.id,
    },
  })

  // Create loan accounts
  const carLoan = await prisma.account.create({
    data: {
      name: 'Honda Civic Auto Loan',
      type: AccountType.LOAN,
      balance: -18450.00, // Negative balance indicates money owed
      loanAmount: 25000.00,
      remainingBalance: 18450.00,
      loanTerm: 60, // 5 years in months
      monthlyPayment: 465.23,
      apr: 4.9,
      userId: user.id,
    },
  })

  const studentLoan = await prisma.account.create({
    data: {
      name: 'Federal Student Loan',
      type: AccountType.LOAN,
      balance: -32780.00, // Negative balance indicates money owed
      loanAmount: 45000.00,
      remainingBalance: 32780.00,
      loanTerm: 120, // 10 years in months
      monthlyPayment: 350.00,
      apr: 5.5,
      userId: user.id,
    },
  })

  const personalLoan = await prisma.account.create({
    data: {
      name: 'Personal Loan - Debt Consolidation',
      type: AccountType.LOAN,
      balance: -8920.00, // Negative balance indicates money owed
      loanAmount: 12000.00,
      remainingBalance: 8920.00,
      loanTerm: 36, // 3 years in months
      monthlyPayment: 315.67,
      apr: 8.99,
      userId: user.id,
    },
  })

  console.log('✅ Created accounts: 10 (2 bank, 5 credit cards, 3 loans)')

  // Helper to get dates
  const today = new Date()
  const getDateDaysAgo = (days: number) => {
    const date = new Date(today)
    date.setDate(date.getDate() - days)
    return date
  }
  const getDateDaysFromNow = (days: number) => {
    const date = new Date(today)
    date.setDate(date.getDate() + days)
    return date
  }

  // Create recurring charges
  const netflixRecurring = await prisma.recurringCharge.create({
    data: {
      name: 'Netflix Subscription',
      amount: 15.99,
      frequency: RecurringFrequency.MONTHLY,
      nextDueDate: getDateDaysFromNow(5),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Subscription')!.id,
      userId: user.id,
    },
  })

  const spotifyRecurring = await prisma.recurringCharge.create({
    data: {
      name: 'Spotify Premium',
      amount: 10.99,
      frequency: RecurringFrequency.MONTHLY,
      nextDueDate: getDateDaysFromNow(12),
      accountId: creditCard2.id,
      categoryId: categories.find(c => c.name === 'Subscription')!.id,
      userId: user.id,
    },
  })

  const gymRecurring = await prisma.recurringCharge.create({
    data: {
      name: 'Gym Membership',
      amount: 49.99,
      frequency: RecurringFrequency.MONTHLY,
      nextDueDate: getDateDaysFromNow(8),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Healthcare')!.id,
      userId: user.id,
    },
  })

  const electricRecurring = await prisma.recurringCharge.create({
    data: {
      name: 'Electric Bill',
      amount: 125.00,
      frequency: RecurringFrequency.MONTHLY,
      nextDueDate: getDateDaysFromNow(15),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Utilities')!.id,
      userId: user.id,
    },
  })

  const internetRecurring = await prisma.recurringCharge.create({
    data: {
      name: 'Internet Service',
      amount: 79.99,
      frequency: RecurringFrequency.MONTHLY,
      nextDueDate: getDateDaysFromNow(3),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Utilities')!.id,
      userId: user.id,
    },
  })

  const phoneRecurring = await prisma.recurringCharge.create({
    data: {
      name: 'Verizon Phone Plan',
      amount: 85.00,
      frequency: RecurringFrequency.MONTHLY,
      nextDueDate: getDateDaysFromNow(20),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Utilities')!.id,
      userId: user.id,
    },
  })

  const carLoanRecurring = await prisma.recurringCharge.create({
    data: {
      name: 'Car Loan Payment',
      amount: 465.23,
      frequency: RecurringFrequency.MONTHLY,
      nextDueDate: getDateDaysFromNow(1),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Transportation')!.id,
      userId: user.id,
    },
  })

  const studentLoanRecurring = await prisma.recurringCharge.create({
    data: {
      name: 'Student Loan Payment',
      amount: 350.00,
      frequency: RecurringFrequency.MONTHLY,
      nextDueDate: getDateDaysFromNow(10),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Shopping')!.id,
      userId: user.id,
    },
  })

  const insuranceRecurring = await prisma.recurringCharge.create({
    data: {
      name: 'Car Insurance',
      amount: 145.00,
      frequency: RecurringFrequency.MONTHLY,
      nextDueDate: getDateDaysFromNow(7),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Transportation')!.id,
      userId: user.id,
    },
  })

  console.log('✅ Created recurring charges: 10')

  // Create transactions for the current month
  const transactions = [
    // Income
    {
      description: 'Monthly Salary',
      amount: 5500.00,
      type: TransactionType.INCOME,
      date: getDateDaysAgo(25),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Salary')!.id,
      isRecurring: false,
    },
    {
      description: 'Freelance Project',
      amount: 1200.00,
      type: TransactionType.INCOME,
      date: getDateDaysAgo(15),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Freelance')!.id,
      isRecurring: false,
    },
    // Expenses - Groceries
    {
      description: 'Whole Foods',
      amount: 127.45,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(2),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Groceries')!.id,
      isRecurring: false,
    },
    {
      description: 'Trader Joes',
      amount: 84.32,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(7),
      accountId: creditCard2.id,
      categoryId: categories.find(c => c.name === 'Groceries')!.id,
      isRecurring: false,
    },
    {
      description: 'Costco',
      amount: 234.67,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(14),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Groceries')!.id,
      isRecurring: false,
    },
    // Dining
    {
      description: 'Chipotle',
      amount: 15.67,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(1),
      accountId: creditCard2.id,
      categoryId: categories.find(c => c.name === 'Dining')!.id,
      isRecurring: false,
    },
    {
      description: 'Starbucks',
      amount: 6.75,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(3),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Dining')!.id,
      isRecurring: false,
    },
    {
      description: 'Local Restaurant',
      amount: 67.89,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(5),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Dining')!.id,
      isRecurring: false,
    },
    {
      description: 'Pizza Place',
      amount: 32.50,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(9),
      accountId: creditCard3.id,
      categoryId: categories.find(c => c.name === 'Dining')!.id,
      isRecurring: false,
    },
    // Entertainment
    {
      description: 'Movie Tickets',
      amount: 28.00,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(6),
      accountId: creditCard2.id,
      categoryId: categories.find(c => c.name === 'Entertainment')!.id,
      isRecurring: false,
    },
    {
      description: 'Concert Tickets',
      amount: 120.00,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(18),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Entertainment')!.id,
      isRecurring: false,
    },
    // Transportation
    {
      description: 'Gas Station',
      amount: 52.34,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(4),
      accountId: creditCard3.id,
      categoryId: categories.find(c => c.name === 'Transportation')!.id,
      isRecurring: false,
    },
    {
      description: 'Uber',
      amount: 23.45,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(8),
      accountId: creditCard2.id,
      categoryId: categories.find(c => c.name === 'Transportation')!.id,
      isRecurring: false,
    },
    {
      description: 'Parking',
      amount: 15.00,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(11),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Transportation')!.id,
      isRecurring: false,
    },
    // Utilities
    {
      description: 'Electric Bill',
      amount: 125.00,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(20),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Utilities')!.id,
      isRecurring: true,
      recurringId: electricRecurring.id,
    },
    {
      description: 'Internet Bill',
      amount: 79.99,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(22),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Utilities')!.id,
      isRecurring: false,
    },
    // Shopping
    {
      description: 'Amazon',
      amount: 89.99,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(10),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Shopping')!.id,
      isRecurring: false,
    },
    {
      description: 'Target',
      amount: 156.78,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(13),
      accountId: creditCard2.id,
      categoryId: categories.find(c => c.name === 'Shopping')!.id,
      isRecurring: false,
    },
    // Healthcare
    {
      description: 'Gym Membership',
      amount: 49.99,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(23),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Healthcare')!.id,
      isRecurring: true,
      recurringId: gymRecurring.id,
    },
    {
      description: 'Pharmacy',
      amount: 25.50,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(16),
      accountId: creditCard3.id,
      categoryId: categories.find(c => c.name === 'Healthcare')!.id,
      isRecurring: false,
    },
    // Subscriptions
    {
      description: 'Netflix Subscription',
      amount: 15.99,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(26),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Subscription')!.id,
      isRecurring: true,
      recurringId: netflixRecurring.id,
    },
    {
      description: 'Spotify Premium',
      amount: 10.99,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(19),
      accountId: creditCard2.id,
      categoryId: categories.find(c => c.name === 'Subscription')!.id,
      isRecurring: true,
      recurringId: spotifyRecurring.id,
    },
  ]

  await prisma.transaction.createMany({
    data: transactions.map(t => ({
      ...t,
      userId: user.id,
    })),
  })

  console.log('✅ Created transactions:', transactions.length)

  console.log('🎉 Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
