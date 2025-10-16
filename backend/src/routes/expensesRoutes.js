import express from "express";
import {getExpenses, createExpense, getSummary, } from "../controllers/expensesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/expenses
 * @desc    Fetch all expenses for the logged-in user
 * @access  Private
 */
router.get("/", protect, getExpenses);

/**
 * @route   POST /api/expenses
 * @desc    Create a new expense
 * @access  Private
 */
router.post("/", protect, createExpense);

/**
 * @route   GET /api/expenses/summary
 * @desc    Get expense totals grouped by category
 * @access  Private
 */
router.get("/summary", protect, getSummary);

export default router;
