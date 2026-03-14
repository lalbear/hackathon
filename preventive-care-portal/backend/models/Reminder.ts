import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, enum: ['Medicine', 'Water Intake', 'Exercise', 'Checkup', 'Vaccination', 'Sleep', 'Nutrition', 'General'], default: 'General' },
  date: { type: Date, required: true },
  reminderTime: { type: String, default: '' }, // HH:MM format
  status: { type: String, enum: ['Pending', 'Completed', 'Missed'], default: 'Pending' },
}, {
  timestamps: true,
});

const Reminder = mongoose.model('Reminder', reminderSchema);
export default Reminder;
