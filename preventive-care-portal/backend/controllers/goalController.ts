import { Request, Response } from 'express';
import Goal from '../models/Goal';

export const getGoals = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ date: -1 });
    res.json(goals);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addGoal = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { steps, waterIntake, sleepHours, date } = req.body;

    const goal = new Goal({
      user: req.user._id,
      steps,
      waterIntake,
      sleepHours,
      date: date || Date.now(),
    });

    const createdGoal = await goal.save();
    res.status(201).json(createdGoal);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
