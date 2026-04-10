import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_eBIrLN0T6hoW@ep-royal-mountain-a1aqnxwu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: DATABASE_URL,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db