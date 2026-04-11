import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const PG_URL = "postgresql://neondb_owner:npg_eBIrLN0T6hoW@ep-royal-mountain-a1aqnxwu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
const dbUrl = process.env.DATABASE_URL?.startsWith("postgresql://") ? process.env.DATABASE_URL : PG_URL

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: dbUrl,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
