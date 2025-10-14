import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getExpenses = async (req, res) => {
  const expenses = await prisma.expense.findMany({
    where: { userId: req.user.id },
    include: { category: true },
    orderBy: { date: "desc" },
  });
  res.json(expenses);
};

export const createExpense = async (req, res) => {
  const { title, amount, categoryId, date } = req.body;
  const expense = await prisma.expense.create({
    data: {
      title,
      amount: parseFloat(amount),
      categoryId,
      date: new Date(date),
      userId: req.user.id,
    },
  });
  res.json(expense);
};

export const getSummary = async (req, res) => { 
  const summary = await prisma.expense.groupBy({
    by: ["categoryId"],
    _sum: { amount: true },
  });

  const data = await Promise.all(
    summary.map(async (s) => {
      const category = await prisma.category.findUnique({ where: { id: s.categoryId } });
      return { category: category.name, total: s._sum.amount };
    })
  );

  res.json(data);
};
