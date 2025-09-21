import express from 'express';
import {
  register,
  login,
  getUserProfile,
  updatePassword,
  updateUserProfile,
  resetPassword,
  verifyCode,
  newPassword,
  getNotifications,
  resetNotificationCount,
  createGroup,
  getUserGroups,
  getGroupById,
  joinGroup,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get((req, res) => {
  res.send('Welcome to the SplitMate!');
});

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:username', getUserProfile);
router.put('/update-password/:username', updatePassword);
router.put('/update-profile/:username', updateUserProfile);
router.post('/reset-password', resetPassword);
router.post('/verify-code', verifyCode);
router.put('/new-password', newPassword);
router.post('/groups/new', createGroup);
router.get('/groups', getUserGroups);
router.get("/groups/:id", getGroupById);
router.post("/groups/join", joinGroup);


router.get('/notifications/:username', getNotifications);
router.post('/notifications/reset/:username', resetNotificationCount);

export default router;
