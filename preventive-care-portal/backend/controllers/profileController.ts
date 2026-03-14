import { Request, Response } from 'express';
import Profile from '../models/Profile';
import User from '../models/User';
import Goal from '../models/Goal';
import Reminder from '../models/Reminder';

export const getProfile = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email');
    
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      profile.age = req.body.age || profile.age;
      profile.allergies = req.body.allergies || profile.allergies;
      profile.medications = req.body.medications || profile.medications;
      profile.conditions = req.body.conditions || profile.conditions;

      const updatedProfile = await profile.save();
      res.json(updatedProfile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProfile = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    // Delete all related documents
    await Profile.deleteMany({ user: userId });
    await Goal.deleteMany({ user: userId });
    await Reminder.deleteMany({ user: userId });
    
    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User account and all associated data deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
