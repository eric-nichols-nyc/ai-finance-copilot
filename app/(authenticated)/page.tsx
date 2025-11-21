import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDateShort, getDaysUntil, getStartOfMonth, getEndOfMonth, calculateUtilization, getUtilizationColor } from '@/lib/utils'

async function getDashboardData() {
  const userId = 'demo-user-id' // In a real app, this would come from auth

  // Get the first user (demo user)
  const user = await prisma.user.findFirst()
  if (!user) throw new Error('No user found')

  const startOfMonth = getStartOfMonth()
  const endOfMonth = getEndOfMonth()

  // Get all transactions for current month
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    include: {
      category: true,
      account: true,
    },
    orderBy: {
      date: 'desc',
    },
  })

  // Calculate monthly stats
  const income = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  // Get top categories
  const categoryTotals = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      const catName = t.category.name
      acc[catName] = (acc[catName] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, total]) => ({
      name,
      total,
      color: transactions.find((t) => t.category.name === name)?.category.color || '#666',
    }))

  // Get upcoming recurring charges (next 2 weeks)
  const twoWeeksFromNow = new Date()
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)

  const upcomingCharges = await prisma.recurringCharge.findMany({
    where: {
      userId: user.id,
      nextDueDate: {
        lte: twoWeeksFromNow,
      },
    },
    include: {
      category: true,
      account: true,
    },
    orderBy: {
      nextDueDate: 'asc',
    },
    take: 5,
  })

  // Get credit card accounts with spending by category
  const creditCards = await prisma.account.findMany({
    where: {
      userId: user.id,
      type: 'CREDIT_CARD',
    },
    include: {
      transactions: {
        where: {
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          type: 'EXPENSE',
        },
        include: {
          category: true,
        },
      },
    },
  })

  return {
    user,
    income,
    expenses,
    netIncome: income - expenses,
    transactionCount: transactions.length,
    topCategories,
    upcomingCharges,
    creditCards,
  }
}

export default async function Dashboard() {
  const data = await getDashboardData()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-600 mt-1">Welcome back, {data.user.name}</p>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200">
          <div className="text-sm text-zinc-600 mb-1">Net Income</div>
          <div className={`text-2xl font-bold ${data.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(data.netIncome)}
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200">
          <div className="text-sm text-zinc-600 mb-1">Income</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(data.income)}</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200">
          <div className="text-sm text-zinc-600 mb-1">Expenses</div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(data.expenses)}</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200">
          <div className="text-sm text-zinc-600 mb-1">Transactions</div>
          <div className="text-2xl font-bold text-zinc-900">{data.transactionCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Categories */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Top Spending Categories</h2>
          <div className="space-y-3">
            {data.topCategories.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-zinc-700">{cat.name}</span>
                </div>
                <span className="font-semibold text-zinc-900">{formatCurrency(cat.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Expenses */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Upcoming Recurring Expenses</h2>
          <div className="space-y-3">
            {data.upcomingCharges.length === 0 ? (
              <p className="text-zinc-500 text-sm">No upcoming charges in the next 2 weeks</p>
            ) : (
              data.upcomingCharges.map((charge) => {
                const daysUntil = getDaysUntil(charge.nextDueDate)
                return (
                  <div key={charge.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-zinc-900 font-medium">{charge.name}</div>
                      <div className="text-sm text-zinc-500">
                        Due {formatDateShort(charge.nextDueDate)} ({daysUntil} days)
                      </div>
                    </div>
                    <span className="font-semibold text-zinc-900">{formatCurrency(charge.amount)}</span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Credit Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.creditCards.map((card) => {
          const utilization = card.creditLimit ? calculateUtilization(card.balance, card.creditLimit) : 0
          const monthlySpend = card.transactions.reduce((sum, t) => sum + t.amount, 0)

          // Group transactions by category
          const categorySpending = card.transactions.reduce((acc, t) => {
            const catName = t.category.name
            acc[catName] = (acc[catName] || 0) + t.amount
            return acc
          }, {} as Record<string, number>)

          const topCardCategories = Object.entries(categorySpending)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)

          return (
            <div key={card.id} className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">{card.name}</h3>
                  <p className="text-sm text-zinc-600">
                    {formatCurrency(card.balance)} / {formatCurrency(card.creditLimit || 0)}
                  </p>
                </div>
                <span className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                  {utilization}% used
                </span>
              </div>

              <div className="w-full bg-zinc-200 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all ${
                    utilization >= 90 ? 'bg-red-600' :
                    utilization >= 70 ? 'bg-orange-600' :
                    utilization >= 50 ? 'bg-yellow-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                />
              </div>

              <div className="mb-3">
                <div className="text-sm text-zinc-600">Spent This Month</div>
                <div className="text-xl font-bold text-zinc-900">{formatCurrency(monthlySpend)}</div>
              </div>

              {topCardCategories.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-zinc-600 mb-2">Top Categories</div>
                  <div className="space-y-1">
                    {topCardCategories.map(([name, amount]) => (
                      <div key={name} className="flex justify-between text-sm">
                        <span className="text-zinc-700">{name}</span>
                        <span className="font-medium text-zinc-900">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
