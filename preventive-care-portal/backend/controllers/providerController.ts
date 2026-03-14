import { Request, Response } from 'express';
import User from '../models/User';
import Profile from '../models/Profile';
import Goal from '../models/Goal';

// For simplicity in MVP, providers can see all patients.
// In a real app, patients would be specifically assigned.
export const getPatients = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const patients = await User.find({ role: 'Patient' }).select('-password');
    res.json(patients);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientDetails = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    if (!user || user.role !== 'Patient') {
       res.status(404).json({ message: 'Patient not found' });
       return;
    }

    const profile = await Profile.findOne({ user: id });
    const goals = await Goal.find({ user: id }).sort({ date: -1 });

    res.json({
      user,
      profile,
      goals
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
