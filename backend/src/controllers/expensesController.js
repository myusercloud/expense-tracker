import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @desc Get all expenses for the logged-in user
 * @route GET /api/expenses
 * @access Private
 */
export const getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user.id },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    return res.status(200).json(expenses);
  } catch (error) {
    console.error("❌ Error fetching expenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses. Please try again later." });
  }
};

/**
 * @desc Create a new expense for the logged-in user
 * @route POST /api/expenses
 * @access Private
 */
export const createExpense = async (req, res) => {
  try {
    const { title, amount, categoryId, date } = req.body;

    // ✅ Input validation
    if (!title || !amount || !categoryId || !date) {
      return res.status(400).json({ error: "All fields (title, amount, categoryId, date) are required." });
    }

    // ✅ Check that category exists
    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found." });
    }

    // ✅ Create the expense
    const expense = await prisma.expense.create({
      data: {
        title: title.trim(),
        amount: parseFloat(amount),
        categoryId,
        date: new Date(date),
        userId: req.user.id,
      },
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error("❌ Error creating expense:", error);
    res.status(500).json({ error: "Failed to create expense. Please try again later." });
  }
};

/**
 * @desc Get total spending summary grouped by category
 * @route GET /api/expenses/summary
 * @access Private
 */
export const getSummary = async (req, res) => {
  try {
    const summary = await prisma.expense.groupBy({
      by: ["categoryId"],
      _sum: { amount: true },
      where: { userId: req.user.id },
    });

    // ✅ Get category names alongside totals
    const data = await Promise.all(
      summary.map(async (s) => {
        const category = await prisma.category.findUnique({
          where: { id: s.categoryId },
        });
        return {
          category: category?.name || "Unknown Category",
          total: s._sum.amount || 0,
        };
      })
    );

    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error generating summary:", error);
    res.status(500).json({ error: "Failed to fetch summary. Please try again later." });
  }
};
