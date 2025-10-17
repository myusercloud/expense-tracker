import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware

    const [totalExpenses, monthlyExpenses, categoryTotals, recentExpenses] = await Promise.all([
      prisma.expense.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),

      prisma.$queryRaw`
        SELECT date_trunc('month', "date") AS month, SUM("amount") AS total
        FROM "Expense"
        WHERE "userId" = ${userId}
        GROUP BY month
        ORDER BY month ASC
      `,

      prisma.$queryRaw`
        SELECT c.name, SUM(e.amount) AS total
        FROM "Expense" e
        JOIN "Category" c ON e."categoryId" = c.id
        WHERE e."userId" = ${userId}
        GROUP BY c.name
        ORDER BY total DESC
      `,

      prisma.expense.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { date: 'desc' },
        take: 10,
      }),
    ]);

    res.json({
      total: totalExpenses._sum.amount || 0,
      monthly: monthlyExpenses,
      categories: categoryTotals,
      recent: recentExpenses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
};
