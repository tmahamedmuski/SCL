import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
//   getStudentDashboard,
//   getTeacherDashboard,
//   getAdminDashboard
} from '../controllers/authController.js';


import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/update-password', updatePassword);

// router.get('/student', authenticate, authorizeRoles('student'), getStudentDashboard);
// router.get('/teacher', authenticate, authorizeRoles('teacher'), getTeacherDashboard);
// router.get('/admin', authenticate, authorizeRoles('admin'), getAdminDashboard);

export default router;
