import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: { type: Number },
  allergies: [{ type: String }],
  medications: [{ type: String }],
  conditions: [{ type: String }],
}, {
  timestamps: true,
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
