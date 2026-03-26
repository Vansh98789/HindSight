import { PrismaClient } from '../../generated/prisma/client'

import { withAccelerate } from '@prisma/extension-accelerate'
console.log("DATABASE_URL:", process.env.DATABASE_URL)

export const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
} as any).$extends(withAccelerate())