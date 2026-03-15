import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  grade:    { type: String },
  otp:      { type: String },
  otpExpires: { type: Date }
});

export default mongoose.model('User', userSchema);
