import { Request, Response } from 'express';
import Reminder from '../models/Reminder';

export const getReminders = async (req: Request | any, res: Response) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id }).sort({ date: 1 });
    res.json(reminders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const addReminder = async (req: Request | any, res: Response) => {
  try {
    const { title, description, category, date, reminderTime } = req.body;
    const reminder = new Reminder({
      user: req.user._id,
      title,
      description: description || '',
      category: category || 'General',
      date,
      reminderTime: reminderTime || '',
      status: 'Pending'
    });
    const createdReminder = await reminder.save();
    res.status(201).json(createdReminder);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const completeReminder = async (req: Request | any, res: Response) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    
    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    reminder.status = 'Completed';
    await reminder.save();
    res.json({ message: 'Reminder marked completed' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReminder = async (req: Request | any, res: Response) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Reminder.deleteOne({ _id: req.params.id });
    res.json({ message: 'Reminder deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
