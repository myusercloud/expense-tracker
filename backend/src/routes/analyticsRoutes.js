import express from 'express';
import { getDashboardData } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js'; // your JWT middleware

const router = express.Router();

router.get('/dashboard', protect, getDashboardData);

export default router;
