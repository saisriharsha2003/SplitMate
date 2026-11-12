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
  markNotificationRead,
  createGroup,
  getUserGroups,
  getUserExpenses,
  getPersonalExpenses,
  createPersonalExpense,
  updatePersonalExpense,
  deletePersonalExpense,
  getDashboardMetrics,
  getGroupById,
  recordSettlement,
  addGroupExpense,
  getGroupExpense,
  updateGroupExpense,
  deleteGroupExpense,
  joinGroup,
  removeGroupMember,
  deleteGroup,
} from '../controllers/userController.js';
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from '../controllers/accountController.js';

const router = express.Router();

router.route('/').get((req, res) => {
  res.send('Welcome to the SplitMate!');
});

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyJWT, getUserProfile);
router.get('/dashboard/metrics', verifyJWT, getDashboardMetrics);
router.put('/profile/password', verifyJWT, updatePassword);
router.put('/profile', verifyJWT, updateUserProfile);
router.route('/accounts').get(verifyJWT, getAccounts).post(verifyJWT, createAccount);
router.route('/accounts/:accountId').put(verifyJWT, updateAccount).delete(verifyJWT, deleteAccount);
router.post('/reset-password', resetPassword);
router.post('/verify-code', verifyCode);
router.put('/new-password', newPassword);
router.post('/groups/new', verifyJWT, createGroup);
router.get('/groups', verifyJWT, getUserGroups);
router.get('/expenses', verifyJWT, getUserExpenses);
router.route('/personal-expenses').get(verifyJWT, getPersonalExpenses).post(verifyJWT, createPersonalExpense);
router.route('/personal-expenses/:expenseId').put(verifyJWT, updatePersonalExpense).delete(verifyJWT, deletePersonalExpense);
router.get("/groups/:id", verifyJWT, getGroupById);
router.post("/groups/:groupId/settlements", verifyJWT, recordSettlement);
router.post("/groups/:id/expenses", verifyJWT, addGroupExpense);
router.get("/groups/:groupId/expenses/:expenseId", verifyJWT, getGroupExpense);
router.put("/groups/:groupId/expenses/:expenseId", verifyJWT, updateGroupExpense);
router.delete("/groups/:groupId/expenses/:expenseId", verifyJWT, deleteGroupExpense);
router.post("/groups/join", verifyJWT, joinGroup);
router.delete("/groups/:groupId/members/:memberId", verifyJWT, removeGroupMember);
router.delete("/groups/:id", verifyJWT, deleteGroup);


router.get('/notifications', verifyJWT, getNotifications);
router.post('/notifications/read-all', verifyJWT, resetNotificationCount);
router.patch('/notifications/:notificationId/read', verifyJWT, markNotificationRead);

export default router;
