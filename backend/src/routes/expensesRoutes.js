import express from "express";
import { getExpenses, createExpense, getSummary } from "../controllers/expensesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getExpenses).post(protect, createExpense);
router.route("/summary").get(protect, getSummary);

export default router;
