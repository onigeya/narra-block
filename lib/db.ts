import { PrismaClient } from "./generated/prisma"
export { Prisma } from './generated/prisma'
export type { User, Role, Permission } from './generated/prisma'
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
export const prisma = globalForPrisma.prisma || new PrismaClient()
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma