import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import isStrongPassword from '../utils/passwordStrength.js';
import { sendOTPEmail } from '../utils/mailer.js';

export const register = async (req, res) => {
  const { username, email, password, confirmPassword, role, grade } = req.body;
  if (!username || !email || !password || !confirmPassword || !role)
    return res.status(400).json({ message: 'All fields required' });
  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });
  
  const emailLocalPart = email.split('@')[0];
  const strength = isStrongPassword(password, emailLocalPart);
  if (!strength.valid) return res.status(400).json({ message: strength.message });

  
  try {
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ message: 'Username or email taken' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, role, grade });
    await user.save();

    res.json({ message: '✅ Registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required' });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No user with that email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTPEmail(user.email, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  const emailLocalPart = email.split('@')[0];
  const strength = isStrongPassword(newPassword, emailLocalPart);
  if (!strength.valid) return res.status(400).json({ message: strength.message });

  

  try {
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updatePassword = async (req, res) => {
  const { email, currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!email || !currentPassword || !newPassword || !confirmNewPassword)
    return res.status(400).json({ message: 'All fields are required' });

  if (newPassword !== confirmNewPassword)
    return res.status(400).json({ message: 'New passwords do not match' });

  const emailLocalPart = email.split('@')[0];
  const strength = isStrongPassword(newPassword, emailLocalPart);
  if (!strength.valid) return res.status(400).json({ message: strength.message });

  

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Example role-protected routes

export const getStudentDashboard = (req, res) => {
  res.json({ message: 'Welcome to the Student dashboard!' });
};

export const getTeacherDashboard = (req, res) => {
  res.json({ message: 'Welcome to the Teacher dashboard!' });
};

export const getAdminDashboard = (req, res) => {
  res.json({ message: 'Welcome to the Admin dashboard!' });
};
