import express from "express";
import { getCategories, createCategory } from "../controllers/categoriesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getCategories).post(protect, createCategory);

export default router;
