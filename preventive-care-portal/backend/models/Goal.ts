import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  steps: { type: Number, default: 0 },
  waterIntake: { type: Number, default: 0 }, // in cups/ml
  sleepHours: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
}, {
  timestamps: true,
});

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
