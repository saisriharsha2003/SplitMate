import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';
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
  addGroupExpense,
  getGroupExpense,
  updateGroupExpense,
  deleteGroupExpense,
  joinGroup,
  removeGroupMember,
  deleteGroup,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get((req, res) => {
  res.send('Welcome to the SplitMate!');
});

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyJWT, getUserProfile);
router.put('/update-password/:username', updatePassword);
router.put('/profile', verifyJWT, updateUserProfile);
router.post('/reset-password', resetPassword);
router.post('/verify-code', verifyCode);
router.put('/new-password', newPassword);
router.post('/groups/new', verifyJWT, createGroup);
router.get('/groups', verifyJWT, getUserGroups);
router.get("/groups/:id", verifyJWT, getGroupById);
router.post("/groups/:id/expenses", verifyJWT, addGroupExpense);
router.get("/groups/:groupId/expenses/:expenseId", verifyJWT, getGroupExpense);
router.put("/groups/:groupId/expenses/:expenseId", verifyJWT, updateGroupExpense);
router.delete("/groups/:groupId/expenses/:expenseId", verifyJWT, deleteGroupExpense);
router.post("/groups/join", verifyJWT, joinGroup);
router.delete("/groups/:groupId/members/:memberId", verifyJWT, removeGroupMember);
router.delete("/groups/:id", verifyJWT, deleteGroup);


router.get('/notifications/:username', getNotifications);
router.post('/notifications/reset/:username', resetNotificationCount);

export default router;
