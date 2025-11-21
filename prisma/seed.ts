import { PrismaClient, AccountType, TransactionType, RecurringFrequency } from '@prisma/client'

const prisma = new PrismaClient()

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
      type: AccountType.BANK_ACCOUNT,
      balance: 5420.50,
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

  console.log('✅ Created accounts: 4')

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

  console.log('✅ Created recurring charges: 4')

  // Create transactions for the current month
  const transactions = [
    // Income
    {
      name: 'Monthly Salary',
      amount: 5500.00,
      type: TransactionType.INCOME,
      date: getDateDaysAgo(25),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Salary')!.id,
      isRecurring: false,
    },
    {
      name: 'Freelance Project',
      amount: 1200.00,
      type: TransactionType.INCOME,
      date: getDateDaysAgo(15),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Freelance')!.id,
      isRecurring: false,
    },
    // Expenses - Groceries
    {
      name: 'Whole Foods',
      amount: 127.45,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(2),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Groceries')!.id,
      isRecurring: false,
    },
    {
      name: 'Trader Joes',
      amount: 84.32,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(7),
      accountId: creditCard2.id,
      categoryId: categories.find(c => c.name === 'Groceries')!.id,
      isRecurring: false,
    },
    {
      name: 'Costco',
      amount: 234.67,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(14),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Groceries')!.id,
      isRecurring: false,
    },
    // Dining
    {
      name: 'Chipotle',
      amount: 15.67,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(1),
      accountId: creditCard2.id,
      categoryId: categories.find(c => c.name === 'Dining')!.id,
      isRecurring: false,
    },
    {
      name: 'Starbucks',
      amount: 6.75,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(3),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Dining')!.id,
      isRecurring: false,
    },
    {
      name: 'Local Restaurant',
      amount: 67.89,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(5),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Dining')!.id,
      isRecurring: false,
    },
    {
      name: 'Pizza Place',
      amount: 32.50,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(9),
      accountId: creditCard3.id,
      categoryId: categories.find(c => c.name === 'Dining')!.id,
      isRecurring: false,
    },
    // Entertainment
    {
      name: 'Movie Tickets',
      amount: 28.00,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(6),
      accountId: creditCard2.id,
      categoryId: categories.find(c => c.name === 'Entertainment')!.id,
      isRecurring: false,
    },
    {
      name: 'Concert Tickets',
      amount: 120.00,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(18),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Entertainment')!.id,
      isRecurring: false,
    },
    // Transportation
    {
      name: 'Gas Station',
      amount: 52.34,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(4),
      accountId: creditCard3.id,
      categoryId: categories.find(c => c.name === 'Transportation')!.id,
      isRecurring: false,
    },
    {
      name: 'Uber',
      amount: 23.45,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(8),
      accountId: creditCard2.id,
      categoryId: categories.find(c => c.name === 'Transportation')!.id,
      isRecurring: false,
    },
    {
      name: 'Parking',
      amount: 15.00,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(11),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Transportation')!.id,
      isRecurring: false,
    },
    // Utilities
    {
      name: 'Electric Bill',
      amount: 125.00,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(20),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Utilities')!.id,
      isRecurring: true,
      recurringId: electricRecurring.id,
    },
    {
      name: 'Internet Bill',
      amount: 79.99,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(22),
      accountId: checkingAccount.id,
      categoryId: categories.find(c => c.name === 'Utilities')!.id,
      isRecurring: false,
    },
    // Shopping
    {
      name: 'Amazon',
      amount: 89.99,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(10),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Shopping')!.id,
      isRecurring: false,
    },
    {
      name: 'Target',
      amount: 156.78,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(13),
      accountId: creditCard2.id,
      categoryId: categories.find(c => c.name === 'Shopping')!.id,
      isRecurring: false,
    },
    // Healthcare
    {
      name: 'Gym Membership',
      amount: 49.99,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(23),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Healthcare')!.id,
      isRecurring: true,
      recurringId: gymRecurring.id,
    },
    {
      name: 'Pharmacy',
      amount: 25.50,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(16),
      accountId: creditCard3.id,
      categoryId: categories.find(c => c.name === 'Healthcare')!.id,
      isRecurring: false,
    },
    // Subscriptions
    {
      name: 'Netflix Subscription',
      amount: 15.99,
      type: TransactionType.EXPENSE,
      date: getDateDaysAgo(26),
      accountId: creditCard1.id,
      categoryId: categories.find(c => c.name === 'Subscription')!.id,
      isRecurring: true,
      recurringId: netflixRecurring.id,
    },
    {
      name: 'Spotify Premium',
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
