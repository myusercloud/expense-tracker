import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding realistic database...');

  const hashedPassword = await bcrypt.hash('password', 10); // ✅ hash once and reuse

  const users = await prisma.$transaction(
    ['harry', 'lucy', 'mike'].map(name =>
      prisma.user.create({
        data: {
          name,
          email: `${name}@example.com`,
          password: hashedPassword, // ✅ store hash
        },
      })
    )
  );

  console.log('✅ Created users:', users.map(u => u.email));

  // --- Create categories ---
  const categoryNames = [
    'Food', 'Transport', 'Shopping', 'Entertainment',
    'Bills', 'Healthcare', 'Education', 'Other'
  ]

  const categories = await prisma.$transaction(
    categoryNames.map(name =>
      prisma.category.create({ data: { name } })
    )
  )

  // --- Weighted helper ---
  const weightedPick = (weights) => {
    const total = weights.reduce((a, b) => a + b.weight, 0)
    const r = Math.random() * total
    let cumulative = 0
    for (const item of weights) {
      cumulative += item.weight
      if (r < cumulative) return item.value
    }
  }

  const startDate = new Date('2023-01-01')
  const endDate = new Date('2025-10-01')
  const expenses = []

  for (const user of users) {
    for (let i = 0; i < 1000; i++) {
      const category = weightedPick([
        { value: categories.find(c => c.name === 'Food'), weight: 40 },
        { value: categories.find(c => c.name === 'Transport'), weight: 20 },
        { value: categories.find(c => c.name === 'Shopping'), weight: 15 },
        { value: categories.find(c => c.name === 'Bills'), weight: 10 },
        { value: categories.find(c => c.name === 'Entertainment'), weight: 8 },
        { value: categories.find(c => c.name === 'Healthcare'), weight: 5 },
        { value: categories.find(c => c.name === 'Education'), weight: 2 }
      ])

      const randomDate = faker.date.between({ from: startDate, to: endDate })
      const amount = (() => {
        if (category.name === 'Bills') return Number(faker.finance.amount(50, 300, 2))
        if (category.name === 'Food') return Number(faker.finance.amount(3, 25, 2))
        if (category.name === 'Entertainment') return Number(faker.finance.amount(10, 100, 2))
        return Number(faker.finance.amount(5, 80, 2))
      })()

      expenses.push({
        title: faker.commerce.productName(),
        amount,
        date: randomDate,
        categoryId: category.id,
        userId: user.id
      })
    }
  }

  await prisma.expense.createMany({ data: expenses })
  console.log(`✅ Seeded ${expenses.length} expenses for ${users.length} users!`)

  const analytics = await prisma.$queryRaw`
    SELECT date_trunc('month', "date") AS period,
           SUM("amount") AS total
    FROM "Expense"
    GROUP BY period
    ORDER BY period;
  `
  console.log('📊 Example monthly totals:')
  console.table(analytics.slice(-6))
}

main()
  .catch(err => {
    console.error('❌ Error seeding data:', err)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🌱 Database connection closed.')
  })
