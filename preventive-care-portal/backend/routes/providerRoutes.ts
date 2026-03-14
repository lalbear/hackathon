import express from 'express';
import { getPatients, getPatientDetails } from '../controllers/providerController';
import { protect, providerOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/patients').get(protect, providerOnly, getPatients);
router.route('/patient/:id').get(protect, providerOnly, getPatientDetails);

export default router;
