import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ---- KPI SUMMARY ----
export const getSummary = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const [totalSpent, avgSpent, topCategories] = await Promise.all([
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { userId: Number(userId) },
      }),
      prisma.expense.aggregate({
        _avg: { amount: true },
        where: { userId: Number(userId) },
      }),
      prisma.expense.groupBy({
        by: ["categoryId"],
        _sum: { amount: true },
        where: { userId: Number(userId) },
        orderBy: { _sum: { amount: "desc" } },
        take: 3,
      }),
    ]);

    const categoryDetails = await Promise.all(
      topCategories.map(async (cat) => {
        const category = await prisma.category.findUnique({
          where: { id: cat.categoryId },
        });
        return { name: category.name, total: cat._sum.amount };
      })
    );

    res.json({
      totalSpent: totalSpent._sum.amount || 0,
      avgSpent: avgSpent._avg.amount || 0,
      topCategories: categoryDetails,
    });
  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---- EXPENSES BY CATEGORY ----
export const getExpensesByCategory = async (req, res) => {
  try {
    const { userId, month, year } = req.query;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const filters = { userId: Number(userId) };
    if (month && year) {
      const start = new Date(`${year}-${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      filters.date = { gte: start, lt: end };
    }

    const grouped = await prisma.expense.groupBy({
      by: ["categoryId"],
      _sum: { amount: true },
      where: filters,
    });

    const result = await Promise.all(
      grouped.map(async (g) => {
        const cat = await prisma.category.findUnique({ where: { id: g.categoryId } });
        return { category: cat.name, total: g._sum.amount };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("Error fetching category data:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---- EXPENSES BY MONTH ----
export const getExpensesByMonth = async (req, res) => {
  try {
    const { userId, year } = req.query;
    if (!userId || !year) return res.status(400).json({ message: "Missing userId or year" });

    const result = await prisma.$queryRaw`
      SELECT
        TO_CHAR("date", 'Mon') AS month,
        SUM("amount") AS total
      FROM "Expense"
      WHERE "userId" = ${Number(userId)} AND EXTRACT(YEAR FROM "date") = ${Number(year)}
      GROUP BY month
      ORDER BY MIN("date");
    `;

    res.json(result);
  } catch (err) {
    console.error("Error fetching monthly data:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---- FILTER OPTIONS ----
export const getAvailableFilters = async (req, res) => {
  try {
    const years = await prisma.$queryRaw`
      SELECT DISTINCT EXTRACT(YEAR FROM "date") AS year FROM "Expense" ORDER BY year DESC;
    `;
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    const categories = await prisma.category.findMany({ select: { id: true, name: true } });

    res.json({
      years: years.map(y => y.year),
      months,
      categories,
    });
  } catch (err) {
    console.error("Error fetching filters:", err);
    res.status(500).json({ message: "Server error" });
  }
};
