import express from 'express';
import {
  signup,
  signin,
  getUserProfile,
  updatePassword,
  updateUserProfile,
  resetPassword,
  verifyCode,
  newPassword,
  getNotifications,
  resetNotificationCount
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get((req, res) => {
  res.send('Welcome to the SplitMate!');
});

router.post('/register', signup);
router.post('/login', signin);
router.get('/profile/:uname', getUserProfile);
router.put('/update-password/:uname', updatePassword);
router.put('/update-profile/:uname', updateUserProfile);
router.post('/reset-password', resetPassword);
router.post('/verify-code', verifyCode);
router.put('/new-password', newPassword);

router.get('/notifications/:username', getNotifications);
router.post('/notifications/reset/:username', resetNotificationCount);

export default router;
