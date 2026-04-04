import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: { passwordHash: adminHash, role: 'admin' },
            create: {
            username: 'admin',
            email: 'admin@pinbarter.org',
            passwordHash: adminHash,
            role: 'admin'
        }
    })
    console.log('Admin user ready:', admin.username)

    const testPin = await prisma.pin.upsert({
        where: { id: 'test-pin-1' },
        update: {},
        create: {
            id: 'test-pin-1',
            name: 'Mickey Mouse Classic',
            series: 'Disney Classics',
            description: 'A classic Mickey Mouse pin',
            isApproved: true,
    }
  })
  console.log('Test pin ready:', testPin.name)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())