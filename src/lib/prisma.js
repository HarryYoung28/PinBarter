import { PrismaClient } from '@prisma/client'

// common pattern used for NextJS and prisma to prevent multiple connections during development

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma