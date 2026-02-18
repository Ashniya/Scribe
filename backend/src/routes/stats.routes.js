import express from 'express';
import { getMyStats } from '../controllers/stats.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes
router.use(protect);
router.get('/my-stats', getMyStats);

export default router;
