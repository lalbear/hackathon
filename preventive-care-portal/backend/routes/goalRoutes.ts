import express from 'express';
import { getGoals, addGoal } from '../controllers/goalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getGoals).post(protect, addGoal);

export default router;
