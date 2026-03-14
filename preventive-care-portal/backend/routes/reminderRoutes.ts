import express from 'express';
import { getReminders, addReminder, completeReminder, deleteReminder } from '../controllers/reminderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getReminders)
  .post(protect, addReminder);

router.route('/:id/complete')
  .put(protect, completeReminder);

router.route('/:id')
  .delete(protect, deleteReminder);

export default router;
