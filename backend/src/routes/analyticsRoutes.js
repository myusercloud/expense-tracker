import express from "express";
import {
  getSummary,
  getExpensesByCategory,
  getExpensesByMonth,
  getAvailableFilters,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/summary", getSummary);
router.get("/expenses-by-category", getExpensesByCategory);
router.get("/expenses-by-month", getExpensesByMonth);
router.get("/filters", getAvailableFilters);

export default router;
