import express from 'express';
import { getProfile, updateProfile, deleteProfile } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getProfile)
  .put(protect, updateProfile)
  .delete(protect, deleteProfile);

export default router;
