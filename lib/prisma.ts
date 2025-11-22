import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  adapter: PrismaPg | undefined
}

// Create the PostgreSQL connection pool and adapter
if (!globalForPrisma.adapter) {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  })
  globalForPrisma.adapter = new PrismaPg(pool)
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: globalForPrisma.adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
