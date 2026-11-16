import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', requireAuth, getDashboardStats);

export default router;
