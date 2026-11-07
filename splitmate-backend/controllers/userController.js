import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import Group from "../models/Groups.js";
import Expense from "../models/Expense.js";
import GroupActivity from "../models/GroupActivity.js";
import PersonalExpense from "../models/PersonalExpense.js";
import Notification from "../models/Notification.js";
import Settlement from "../models/Settlement.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const recordGroupActivity = async (groupId, actor, action, message, details = {}) => {
  const activity = await GroupActivity.create({ groupId, actor, action, message, details });
  try {
    const group = await Group.findById(groupId).select("members");
    const recipients = (group?.members || [])
      .map((member) => member.user.toString())
      .filter((userId) => userId !== String(actor));
    if (recipients.length) {
      await Notification.insertMany(recipients.map((recipient) => ({
        recipient, actor, groupId, message,
      })));
    }
  } catch (error) {
    console.error("Could not create group notifications:", error.message);
  }
  return activity;
};

const getGroupDebtDetails = async (groupId, members) => {
  const memberNames = new Map(members.map((member) => [
    String(member.user?._id || member.user),
    member.user?.name || "Unknown member",
  ]));
  const pairCents = new Map();
  const addPairBalance = (debtorId, creditorId, cents) => {
    if (debtorId === creditorId || !memberNames.has(debtorId) || !memberNames.has(creditorId) || !cents) return;
    const [firstId, secondId] = [debtorId, creditorId].sort();
    const key = `${firstId}:${secondId}`;
    pairCents.set(key, (pairCents.get(key) || 0) + (debtorId === firstId ? cents : -cents));
  };
  const [expenses, settlements] = await Promise.all([
    Expense.find({ groupId }).select("amount paidBy splitAmong"),
    Settlement.find({ groupId }).select("payer payee amount"),
  ]);
  for (const expense of expenses) {
    const payerId = String(expense.paidBy);
    for (const split of expense.splitAmong || []) {
      const debtorId = String(split.user);
      if (debtorId !== payerId) {
        addPairBalance(debtorId, payerId, Math.round(Number(split.shareAmount ?? (expense.amount / expense.splitAmong.length)) * 100));
      }
    }
  }
  for (const settlement of settlements) {
    const payerId = String(settlement.payer);
    const payeeId = String(settlement.payee);
    const amountCents = Math.round(Number(settlement.amount) * 100);
    addPairBalance(payeeId, payerId, amountCents);
  }
  const debts = [...pairCents.entries()]
    .filter(([, balance]) => balance !== 0)
    .map(([key, balance]) => {
      const [firstId, secondId] = key.split(":");
      const debtorId = balance > 0 ? firstId : secondId;
      const creditorId = balance > 0 ? secondId : firstId;
      return {
        debtorId,
        debtorName: memberNames.get(debtorId),
        creditorId,
        creditorName: memberNames.get(creditorId),
        amount: Math.abs(balance) / 100,
      };
    })
    .sort((a, b) => b.amount - a.amount || a.debtorName.localeCompare(b.debtorName));
  return debts;
};

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;
const JWT_SECRET = process.env.JWT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const MONGODB_URL = process.env.MONGODB_URL;

export const register = async (req, res) => {
  const { name, email, mobile, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      username: username,
      password: hashedPassword,
      default_currency: req.body.default_currency || "INR",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Username Not Found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Wrong Password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(StatusCodes.OK).json({
      token,
      name: user.name,
      username: user.username,
      message: "Login Successfull!!",
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error signing in" });
  }
};

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendResetEmail(email, resetCode) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    await transporter.sendMail({
      from: `"NoteNexus" <${EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}`,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email could not be sent.");
  }
}

export const resetPassword = async (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "If an account exists for that email, a verification code has been sent." });

    const resetCode = crypto.randomInt(100000, 999999).toString();
    const hashedCode = await bcrypt.hash(resetCode, 10);

    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    user.passwordResetTokenHash = null;
    user.passwordResetTokenExpires = null;
    await user.save();

    await sendResetEmail(email, resetCode);

    res.json({ message: "Verification code sent to email" });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ error: "Verification code not sent" });
  }
};

export const verifyCode = async (req, res) => {
  const reset_email = typeof req.body.reset_email === "string" ? req.body.reset_email.trim().toLowerCase() : "";
  const code = typeof req.body.code === "string" ? req.body.code.trim() : "";
  try {
    if (!reset_email || !/^\d{6}$/.test(code)) return res.status(400).json({ error: "Enter a valid email and 6-digit verification code" });
    const user = await User.findOne({ email: reset_email });
    if (!user || !user.resetPasswordCode)
      return res.status(400).json({ error: "Invalid request" });

    const isMatch = await bcrypt.compare(code, user.resetPasswordCode);
    if (!isMatch || Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetTokenHash = await bcrypt.hash(resetToken, 10);
    user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    res.json({ message: "Code verified", resetToken });
  } catch (error) {
    res.status(500).json({ error: "Error verifying code" });
  }
};

export const newPassword = async (req, res) => {
  const reset_email = typeof req.body.reset_email === "string" ? req.body.reset_email.trim().toLowerCase() : "";
  const { newPassword, resetToken } = req.body;
  try {
    if (typeof reset_email !== "string" || typeof newPassword !== "string" || newPassword.length < 6 || typeof resetToken !== "string") {
      return res.status(400).json({ error: "A valid reset token and a password of at least 6 characters are required" });
    }
    const user = await User.findOne({ email: reset_email });
    if (!user || !user.passwordResetTokenHash || !user.passwordResetTokenExpires || Date.now() > user.passwordResetTokenExpires.getTime()) {
      return res.status(400).json({ error: "Reset session is invalid or expired. Request a new code." });
    }
    const tokenMatches = await bcrypt.compare(resetToken, user.passwordResetTokenHash);
    if (!tokenMatches) return res.status(400).json({ error: "Reset session is invalid or expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordResetTokenHash = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { name, currency } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Group name is required" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const initialMembers = [{ user: user._id, joinedAt: new Date(), role: "admin" }];
    const joinCode = crypto.randomBytes(16).toString("hex").toUpperCase();

    const group = new Group({
      name,
      currency: currency || user.default_currency || "INR",
      createdBy: user._id,
      members: initialMembers,
      joinCode,
    });

    await group.save();
    await recordGroupActivity(group._id, user._id, "group_created", "created the group");
    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ "members.user": req.user.userId })
      .populate("createdBy", "name email username")
      .populate("members.user", "name email username")
      .sort({ createdAt: -1 });
    res.status(200).json(groups);
  } catch (error) {
    console.error("❌ Error in getAllGroups:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserExpenses = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
    const groups = await Group.find({ "members.user": req.user.userId }).select("_id");
    const groupIds = groups.map((group) => group._id);
    const filter = { groupId: { $in: groupIds } };
    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .populate("groupId", "name currency")
        .populate("paidBy", "name username")
        .populate("splitAmong.user", "name username")
        .sort({ date: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Expense.countDocuments(filter),
    ]);

    return res.json({ expenses, total, page, pages: Math.ceil(total / limit), limit });
  } catch (error) {
    console.error("Error fetching user expenses:", error);
    return res.status(500).json({ error: "Could not load expense history" });
  }
};

const parsePersonalExpense = (body) => {
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const amount = Number(body.amount);
  const date = typeof body.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
    ? new Date(`${body.date}T00:00:00.000Z`)
    : new Date(NaN);
  if (!description || description.length > 140) throw new Error("Enter a description up to 140 characters");
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter an amount greater than zero");
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== body.date) {
    throw new Error("Choose a valid expense date");
  }
  const currency = body.currency || "INR";
  if (!["INR", "USD", "EUR", "GBP"].includes(currency)) throw new Error("Choose a supported currency");
  const category = typeof body.category === "string" && body.category.trim() ? body.category.trim() : "Other";
  if (category.length > 40) throw new Error("Category must be 40 characters or fewer");
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";
  if (notes.length > 500) throw new Error("Notes must be 500 characters or fewer");
  return { description, amount: Math.round(amount * 100) / 100, currency, category, date, notes };
};

export const getPersonalExpenses = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 5));
    const filter = { owner: req.user.userId };
    if (req.query.month && /^\d{4}-\d{2}$/.test(req.query.month)) {
      const [year, month] = req.query.month.split("-").map(Number);
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 1));
      filter.date = { $gte: start, $lt: end };
    }
    const [expenses, user, monthTotals] = await Promise.all([
      PersonalExpense.find(filter).sort({ date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      User.findById(req.user.userId).select("default_currency"),
      PersonalExpense.aggregate([
        { $match: { ...filter, owner: new mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: "$currency", amount: { $sum: "$amount" } } },
      ]),
    ]);
    const total = await PersonalExpense.countDocuments(filter);
    const monthList = await PersonalExpense.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(req.user.userId) } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date", timezone: "UTC" } } } },
      { $sort: { _id: -1 } },
    ]);
    return res.json({ expenses, currency: user?.default_currency || "INR", total, page, pages: Math.ceil(total / limit), limit, months: monthList.map((item) => item._id), monthTotals: monthTotals.map((item) => ({ currency: item._id || "INR", amount: item.amount })) });
  } catch (error) {
    console.error("Error fetching personal expenses:", error);
    return res.status(500).json({ error: "Could not load personal expenses" });
  }
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    const [groups, user] = await Promise.all([
      Group.find({ "members.user": req.user.userId }).select("_id name currency members"),
      User.findById(req.user.userId).select("default_currency"),
    ]);
    const groupIds = groups.map((group) => group._id);
    const [groupAllTime, groupThisMonth, personalAllTime, personalThisMonth, topPersonalCategories] = await Promise.all([
      Expense.aggregate([
        { $match: { groupId: { $in: groupIds } } },
        { $group: { _id: "$currency", amount: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Expense.aggregate([
        { $match: { groupId: { $in: groupIds }, date: { $gte: monthStart, $lt: nextMonthStart } } },
        { $group: { _id: "$currency", amount: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      PersonalExpense.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: "$currency", amount: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      PersonalExpense.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(req.user.userId), date: { $gte: monthStart, $lt: nextMonthStart } } },
        { $group: { _id: "$currency", amount: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      PersonalExpense.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(req.user.userId), date: { $gte: monthStart, $lt: nextMonthStart } } },
        { $group: { _id: { name: "$category", currency: "$currency" }, amount: { $sum: "$amount" }, count: { $sum: 1 } } },
        { $sort: { amount: -1 } },
        { $limit: 1 },
      ]),
    ]);

    return res.json({
      month: monthStart.toISOString().slice(0, 7),
      currency: user?.default_currency || "INR",
      groups: {
        count: groups.length,
        memberCount: groups.reduce((total, group) => total + group.members.length, 0),
        expenseCount: groupAllTime.reduce((total, item) => total + item.count, 0),
        allTimeByCurrency: groupAllTime.map(({ _id, amount, count }) => ({ currency: _id || "INR", amount, count })),
        thisMonthByCurrency: groupThisMonth.map(({ _id, amount, count }) => ({ currency: _id || "INR", amount, count })),
      },
      personal: {
        expenseCount: personalAllTime.reduce((total, item) => total + item.count, 0),
        allTimeByCurrency: personalAllTime.map(({ _id, amount, count }) => ({ currency: _id || "INR", amount, count })),
        thisMonthByCurrency: personalThisMonth.map(({ _id, amount, count }) => ({ currency: _id || "INR", amount, count })),
        topCategory: topPersonalCategories[0] ? {
          name: topPersonalCategories[0]._id.name || "Other",
          currency: topPersonalCategories[0]._id.currency || user?.default_currency || "INR",
          amount: topPersonalCategories[0].amount,
          count: topPersonalCategories[0].count,
        } : null,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return res.status(500).json({ error: "Could not load dashboard metrics" });
  }
};

export const createPersonalExpense = async (req, res) => {
  try {
    let input;
    try { input = parsePersonalExpense(req.body); }
    catch (error) { return res.status(400).json({ error: error.message }); }
    const user = await User.findById(req.user.userId).select("default_currency");
    const expense = await PersonalExpense.create({
      owner: req.user.userId,
      ...input,
      currency: req.body.currency || user?.default_currency || "INR",
    });
    return res.status(201).json({ message: "Personal expense added", expense });
  } catch (error) {
    console.error("Error creating personal expense:", error);
    return res.status(500).json({ error: "Could not add personal expense" });
  }
};

export const updatePersonalExpense = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.expenseId)) return res.status(400).json({ error: "Invalid expense ID" });
    let input;
    try { input = parsePersonalExpense(req.body); }
    catch (error) { return res.status(400).json({ error: error.message }); }
    const expense = await PersonalExpense.findOneAndUpdate(
      { _id: req.params.expenseId, owner: req.user.userId },
      input,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ error: "Personal expense not found" });
    return res.json({ message: "Personal expense updated", expense });
  } catch (error) {
    console.error("Error updating personal expense:", error);
    return res.status(500).json({ error: "Could not update personal expense" });
  }
};

export const deletePersonalExpense = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.expenseId)) return res.status(400).json({ error: "Invalid expense ID" });
    const expense = await PersonalExpense.findOneAndDelete({ _id: req.params.expenseId, owner: req.user.userId });
    if (!expense) return res.status(404).json({ error: "Personal expense not found" });
    return res.json({ message: "Personal expense deleted" });
  } catch (error) {
    console.error("Error deleting personal expense:", error);
    return res.status(500).json({ error: "Could not delete personal expense" });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const group = await Group.findById(id)
      .populate("createdBy", "name username email")
      .populate("members.user", "name username email");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!group.members.some((member) => member.user?._id?.toString() === userId)) {
      return res.status(403).json({ error: "You are not a member of this group" });
    }

    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const activityPage = Math.max(1, Number.parseInt(req.query.activityPage, 10) || 1);
    const debtPage = Math.max(1, Number.parseInt(req.query.debtPage, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 5));
    const activityLimit = Math.min(50, Math.max(1, Number.parseInt(req.query.activityLimit, 10) || 5));
    const debtLimit = Math.min(50, Math.max(1, Number.parseInt(req.query.debtLimit, 10) || 5));
    const expenseFilter = { groupId: group._id };
    const [expenses, expenseTotal, debts] = await Promise.all([
      Expense.find(expenseFilter)
      .populate("paidBy", "name username email")
      .populate("createdBy", "name username email")
      .populate("lastUpdatedBy", "name username email")
      .populate("splitAmong.user", "name username email")
      .sort({ date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Expense.countDocuments(expenseFilter),
      getGroupDebtDetails(group._id, group.members),
    ]);
    const [activityRecords, activityTotal] = await Promise.all([
      GroupActivity.find({ groupId: group._id })
        .populate("actor", "name username")
        .sort({ createdAt: -1 })
        .skip((activityPage - 1) * activityLimit)
        .limit(activityLimit),
      GroupActivity.countDocuments({ groupId: group._id }),
    ]);
    const activity = activityRecords.map((record) => record.toObject());
    const legacySplitIds = [...new Set(activity.flatMap((item) => {
      if (item.details?.splitBreakdown?.length) return [];
      const splits = item.details?.split || item.details?.participants || [];
      return splits.map((split) => String(split?.user?._id || split?.user || "")).filter(Boolean);
    }))];
    const legacySplitUsers = legacySplitIds.length
      ? await User.find({ _id: { $in: legacySplitIds } }).select("name")
      : [];
    activity.forEach((item) => {
      if (item.details?.splitBreakdown?.length) return;
      const splits = item.details?.split || item.details?.participants || [];
      if (!splits.length) return;
      item.details.splitBreakdown = splits.map((split) => {
        const userId = String(split?.user?._id || split?.user || "");
        return {
          name: legacySplitUsers.find((user) => user._id.toString() === userId)?.name || "Unknown member",
          shareAmount: split.shareAmount,
          percentage: split.percentage,
        };
      });
    });

    const userDebts = debts.filter((debt) => debt.debtorId === userId.toString() || debt.creditorId === userId.toString());
    const result = {
      _id: group._id,
      currentUserId: userId.toString(),
      name: group.name,
      createdBy: group.createdBy,
      members: group.members,
      activity,
      debts: userDebts.slice((debtPage - 1) * debtLimit, debtPage * debtLimit),
      myDebts: debts.filter((debt) => debt.debtorId === userId.toString()),
      myDebtsToMe: debts.filter((debt) => debt.creditorId === userId.toString()),
      currency: group.currency,
      joinCode: group.joinCode,
      expenses,
      expensePagination: { page, pages: Math.ceil(expenseTotal / limit), total: expenseTotal, limit },
      activityPagination: { page: activityPage, pages: Math.ceil(activityTotal / activityLimit), total: activityTotal, limit: activityLimit },
      debtPagination: { page: debtPage, pages: Math.ceil(userDebts.length / debtLimit), total: userDebts.length, limit: debtLimit },
    };

    res.json(result);
  } catch (err) {
    console.error("❌ Error in getGroupById:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const recordSettlement = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { note = "" } = req.body;
    const payments = Array.isArray(req.body.payments)
      ? req.body.payments
      : [{ payeeId: req.body.payeeId, amount: req.body.amount }];
    const payerId = String(req.user.userId);
    if (!mongoose.isValidObjectId(groupId) || !Array.isArray(payments) || payments.length < 1 || payments.length > 100) return res.status(400).json({ error: "Choose at least one valid group payment" });
    if (typeof note !== "string" || note.trim().length > 240) return res.status(400).json({ error: "Payment note must be 240 characters or fewer" });
    const group = await Group.findById(groupId).populate("members.user", "name username");
    if (!group) return res.status(404).json({ error: "Group not found" });
    const memberIds = group.members.map((member) => String(member.user?._id || member.user));
    if (!memberIds.includes(payerId)) return res.status(403).json({ error: "You are not a member of this group" });
    const debts = await getGroupDebtDetails(group._id, group.members);
    const myDebts = debts.filter((debt) => debt.debtorId === payerId);
    if (!myDebts.length) return res.status(400).json({ error: "You do not have an outstanding amount to settle" });
    const normalizedPayments = [];
    const seenPayees = new Set();
    for (const payment of payments) {
      const payeeId = String(payment?.payeeId || "");
      const amount = Number(payment?.amount);
      if (!mongoose.isValidObjectId(payeeId) || payeeId === payerId || !memberIds.includes(payeeId) || seenPayees.has(payeeId)) {
        return res.status(400).json({ error: "Choose a valid, unique group member for each payment" });
      }
      if (!Number.isFinite(amount) || amount <= 0 || Math.round(amount * 100) !== amount * 100) {
        return res.status(400).json({ error: "Enter valid payment amounts with up to two decimal places" });
      }
      const directDebt = myDebts.find((debt) => debt.creditorId === payeeId);
      if (!directDebt || amount > directDebt.amount + 0.001) {
        return res.status(400).json({ error: "A payment cannot exceed the amount you owe that member" });
      }
      seenPayees.add(payeeId);
      normalizedPayments.push({ payeeId, amount: Math.round(amount * 100) / 100 });
    }
    const totalPayment = Math.round(normalizedPayments.reduce((sum, payment) => sum + payment.amount, 0) * 100) / 100;
    const totalOwed = myDebts.reduce((sum, debt) => sum + debt.amount, 0);
    if (totalPayment > totalOwed + 0.001) {
      return res.status(400).json({ error: `Total payment cannot exceed your outstanding amount of ${group.currency || "INR"} ${totalOwed.toFixed(2)}` });
    }
    const records = await Settlement.insertMany(normalizedPayments.map((payment) => ({
      groupId: group._id,
      payer: payerId,
      payee: payment.payeeId,
      amount: payment.amount,
      currency: group.currency || "INR",
      date: new Date(),
      note: note.trim(),
    })));
    const payerName = group.members.find((member) => String(member.user?._id || member.user) === payerId)?.user?.name || "A member";
    try {
      for (const settlement of records) {
        const payeeName = group.members.find((member) => String(member.user?._id || member.user) === String(settlement.payee))?.user?.name || "A member";
        await recordGroupActivity(group._id, payerId, "settlement_recorded", `recorded a payment of ${group.currency || "INR"} ${settlement.amount.toFixed(2)} to ${payeeName}${note.trim() ? ` (${note.trim()})` : ""}`, {
          settlementId: settlement._id,
          payerId,
          payerName,
          payeeId: String(settlement.payee),
          payeeName,
          amount: settlement.amount,
          currency: settlement.currency,
          note: note.trim(),
        });
      }
    } catch (error) {
      await Promise.all([
        Settlement.deleteMany({ _id: { $in: records.map((record) => record._id) } }),
        GroupActivity.deleteMany({ "details.settlementId": { $in: records.map((record) => record._id) } }),
      ]);
      throw error;
    }
    return res.status(201).json({ message: `${records.length === 1 ? "Payment" : "Payments"} recorded`, settlementIds: records.map((record) => record._id) });
  } catch (error) {
    console.error("Error recording group settlement:", error);
    return res.status(500).json({ error: "Could not record this payment" });
  }
};

const buildExpenseSplits = (splitType, totalCents, uniqueParticipants, shares) => {
  const invalid = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  };

  if (splitType === "percentage") {
    if (!Array.isArray(shares) || shares.length !== uniqueParticipants.length) {
      invalid("Provide one percentage for each selected participant");
    }
    const percentages = new Map();
    for (const share of shares) {
      const userId = String(share?.userId || "");
      const percentage = Number(share?.percentage);
      if (!uniqueParticipants.includes(userId) || percentages.has(userId) || !Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
        invalid("One or more percentages are invalid");
      }
      percentages.set(userId, Math.round(percentage * 100));
    }
    if ([...percentages.values()].reduce((sum, value) => sum + value, 0) !== 10000) {
      invalid("Percentages must add up to 100%");
    }

    const allocations = uniqueParticipants.map((userId, index) => {
      const exactCents = totalCents * percentages.get(userId) / 10000;
      const cents = Math.floor(exactCents);
      return { userId, index, percentage: percentages.get(userId) / 100, cents, remainder: exactCents - cents };
    });
    const centsLeft = totalCents - allocations.reduce((sum, allocation) => sum + allocation.cents, 0);
    [...allocations]
      .sort((a, b) => b.remainder - a.remainder || a.index - b.index)
      .slice(0, centsLeft)
      .forEach((allocation) => { allocation.cents += 1; });
    return allocations.map(({ userId, cents, percentage }) => ({ user: userId, shareAmount: cents / 100, percentage }));
  }

  if (splitType === "amount") {
    if (!Array.isArray(shares) || shares.length !== uniqueParticipants.length) {
      invalid("Provide one custom amount for each selected participant");
    }
    const customShares = new Map();
    for (const share of shares) {
      const userId = String(share?.userId || "");
      const shareAmount = Number(share?.shareAmount);
      if (!uniqueParticipants.includes(userId) || customShares.has(userId) || !Number.isFinite(shareAmount) || shareAmount < 0) {
        invalid("One or more custom amounts are invalid");
      }
      customShares.set(userId, Math.round(shareAmount * 100));
    }
    const customTotalCents = [...customShares.values()].reduce((sum, shareCents) => sum + shareCents, 0);
    if (customShares.size !== uniqueParticipants.length || customTotalCents !== totalCents) {
      invalid("Custom amounts must add up to the total expense amount");
    }
    return uniqueParticipants.map((userId) => ({ user: userId, shareAmount: customShares.get(userId) / 100 }));
  }

  if (shares !== undefined) invalid("Equal splits do not accept custom shares");
  const baseShareCents = Math.floor(totalCents / uniqueParticipants.length);
  const extraCents = totalCents % uniqueParticipants.length;
  return uniqueParticipants.map((userId, index) => ({
    user: userId,
    shareAmount: (baseShareCents + (index < extraCents ? 1 : 0)) / 100,
  }));
};

export const addGroupExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, date, payer, participants, shares, splitType = "equal" } = req.body;
    const cleanDescription = typeof description === "string" ? description.trim() : "";
    const expenseAmount = Number(amount);

    if (!cleanDescription) {
      return res.status(400).json({ error: "Expense description is required" });
    }
    if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) {
      return res.status(400).json({ error: "Enter an amount greater than zero" });
    }
    const expenseDate = date === undefined ? new Date() : new Date(`${date}T00:00:00.000Z`);
    if (
      (date !== undefined && (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))) ||
      !Number.isFinite(expenseDate.getTime()) ||
      expenseDate.toISOString().slice(0, 10) !== (date || expenseDate.toISOString().slice(0, 10))
    ) {
      return res.status(400).json({ error: "Enter a valid expense date" });
    }
    if (!["equal", "percentage", "amount"].includes(splitType)) {
      return res.status(400).json({ error: "Choose a valid split type" });
    }
    if (!mongoose.isValidObjectId(payer) || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: "Choose a payer and at least one participant" });
    }

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const currentUserId = req.user.userId.toString();
    const memberIds = group.members.map((member) => member.user.toString());
    if (!memberIds.includes(currentUserId)) {
      return res.status(403).json({ error: "You are not a member of this group" });
    }
    if (!memberIds.includes(payer)) {
      return res.status(400).json({ error: "The payer must be a member of this group" });
    }

    const uniqueParticipants = [...new Set(participants.map(String))];
    if (uniqueParticipants.some((participantId) => !memberIds.includes(participantId))) {
      return res.status(400).json({ error: "All participants must be members of this group" });
    }

    const totalCents = Math.round(expenseAmount * 100);
    let splitAmong;
    try {
      splitAmong = buildExpenseSplits(splitType, totalCents, uniqueParticipants, shares);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const expense = await Expense.create({
      groupId: group._id,
      description: cleanDescription,
      amount: totalCents / 100,
      date: expenseDate,
      currency: group.currency || "INR",
      splitType,
      paidBy: payer,
      createdBy: currentUserId,
      lastUpdatedBy: currentUserId,
      splitAmong,
    });
    const participantUsers = await User.find({ _id: { $in: uniqueParticipants } }).select("name");
    const participantNames = uniqueParticipants.map((participantId) =>
      participantUsers.find((participant) => participant._id.toString() === participantId)?.name || "A member"
    );
    await recordGroupActivity(group._id, currentUserId, "expense_added", `added “${cleanDescription}” (${group.currency || "INR"} ${(totalCents / 100).toFixed(2)}) and split it between ${participantNames.join(", ")}`, {
      expenseId: expense._id,
      description: cleanDescription,
      amount: totalCents / 100,
      splitBreakdown: splitAmong.map((split) => ({
        name: participantUsers.find((participant) => participant._id.toString() === split.user.toString())?.name || "Unknown member",
        shareAmount: split.shareAmount,
        percentage: split.percentage,
      })),
    });
    return res.status(201).json({
      message: "Expense added successfully",
      expenseId: expense._id,
    });
  } catch (error) {
    console.error("Error adding group expense:", error);
    return res.status(500).json({ error: "Could not add expense" });
  }
};

export const getGroupExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;
    if (!mongoose.isValidObjectId(groupId) || !mongoose.isValidObjectId(expenseId)) {
      return res.status(400).json({ error: "Invalid group or expense ID" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    const currentUserId = req.user.userId.toString();
    if (!group.members.some((member) => member.user.toString() === currentUserId)) {
      return res.status(403).json({ error: "You are not a member of this group" });
    }

    const expense = await Expense.findOne({ _id: expenseId, groupId: group._id })
      .populate("paidBy", "name username email")
      .populate("createdBy", "name username email")
      .populate("lastUpdatedBy", "name username email")
      .populate("splitAmong.user", "name username email");
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    return res.json({ group: { _id: group._id, name: group.name, currency: group.currency }, expense });
  } catch (error) {
    console.error("Error fetching group expense:", error);
    return res.status(500).json({ error: "Could not load expense" });
  }
};

export const updateGroupExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;
    const { description, amount, date, payer, participants, shares, splitType = "equal" } = req.body;
    if (!mongoose.isValidObjectId(groupId) || !mongoose.isValidObjectId(expenseId)) {
      return res.status(400).json({ error: "Invalid group or expense ID" });
    }

    const cleanDescription = typeof description === "string" ? description.trim() : "";
    const expenseAmount = Number(amount);
    if (!cleanDescription) return res.status(400).json({ error: "Expense description is required" });
    if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) {
      return res.status(400).json({ error: "Enter an amount greater than zero" });
    }
    const expenseDate = typeof date === "string" ? new Date(`${date}T00:00:00.000Z`) : new Date(NaN);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date || "") ||
      !Number.isFinite(expenseDate.getTime()) ||
      expenseDate.toISOString().slice(0, 10) !== date
    ) {
      return res.status(400).json({ error: "Enter a valid expense date" });
    }
    if (!["equal", "percentage", "amount"].includes(splitType)) {
      return res.status(400).json({ error: "Choose a valid split type" });
    }
    if (!mongoose.isValidObjectId(payer) || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: "Choose a payer and at least one participant" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    const currentUserId = req.user.userId.toString();
    if (!group.members.some((member) => member.user.toString() === currentUserId)) {
      return res.status(403).json({ error: "You are not a member of this group" });
    }

    const memberIds = group.members.map((member) => member.user.toString());
    const uniqueParticipants = [...new Set(participants.map(String))];
    if (!memberIds.includes(payer) || uniqueParticipants.some((participantId) => !memberIds.includes(participantId))) {
      return res.status(400).json({ error: "The payer and participants must be group members" });
    }

    const expense = await Expense.findOne({ _id: expenseId, groupId: group._id });
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    const oldState = {
      description: expense.description,
      amount: expense.amount,
      paidBy: expense.paidBy.toString(),
      splitType: expense.splitType,
      splitAmong: expense.splitAmong.map((split) => ({ user: split.user.toString(), shareAmount: split.shareAmount })),
    };
    let splitAmong;
    try {
      splitAmong = buildExpenseSplits(splitType, Math.round(expenseAmount * 100), uniqueParticipants, shares);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    expense.description = cleanDescription;
    expense.amount = Math.round(expenseAmount * 100) / 100;
    expense.date = expenseDate;
    expense.paidBy = payer;
    expense.splitType = splitType;
    expense.splitAmong = splitAmong;
    expense.lastUpdatedBy = currentUserId;
    await expense.save();

    const changes = [];
    if (oldState.description !== cleanDescription) changes.push(`description changed from “${oldState.description}” to “${cleanDescription}”`);
    if (oldState.amount !== expense.amount) changes.push(`total changed from ${group.currency || "INR"} ${oldState.amount.toFixed(2)} to ${group.currency || "INR"} ${expense.amount.toFixed(2)}`);
    if (oldState.paidBy !== payer) changes.push("payer changed");
    const newSplits = splitAmong.map((split) => ({ user: split.user.toString(), shareAmount: split.shareAmount }));
    const oldParticipantIds = oldState.splitAmong.map((split) => split.user);
    const newParticipantIds = newSplits.map((split) => split.user);
    const addedIds = newParticipantIds.filter((userId) => !oldParticipantIds.includes(userId));
    const removedIds = oldParticipantIds.filter((userId) => !newParticipantIds.includes(userId));
    const changedShares = newSplits.filter((next) => {
      const previous = oldState.splitAmong.find((split) => split.user === next.user);
      return previous && previous.shareAmount !== next.shareAmount;
    });
    const participantIds = [...new Set([...oldParticipantIds, ...newParticipantIds])];
    const activityPeople = participantIds.length ? await User.find({ _id: { $in: participantIds } }).select("name") : [];
    const personName = (userId) => activityPeople.find((person) => person._id.toString() === userId)?.name || "A member";
    if (oldState.splitType !== splitType) changes.push(`split type changed from ${oldState.splitType} to ${splitType}`);
    if (addedIds.length) changes.push(`added ${addedIds.map(personName).join(", ")} to the split`);
    if (removedIds.length) changes.push(`removed ${removedIds.map(personName).join(", ")} from the split`);
    if (changedShares.length) changes.push(`updated shares: ${changedShares.map((split) => {
      const previous = oldState.splitAmong.find((entry) => entry.user === split.user);
      return `${personName(split.user)} (${group.currency || "INR"} ${previous.shareAmount.toFixed(2)} to ${group.currency || "INR"} ${split.shareAmount.toFixed(2)})`;
    }).join(", ")}`);
    await recordGroupActivity(group._id, currentUserId, "expense_updated", `updated “${cleanDescription}”${changes.length ? `: ${changes.join("; ")}` : ""}`, {
      expenseId: expense._id,
      description: cleanDescription,
      previousAmount: oldState.amount,
      amount: expense.amount,
      changes,
      previousSplit: oldState.splitAmong,
      split: newSplits,
      splitBreakdown: newSplits.map((split) => ({
        name: personName(split.user),
        shareAmount: split.shareAmount,
        percentage: Number.isFinite(Number(shares?.find((entry) => String(entry.userId) === split.user)?.percentage))
          ? Number(shares.find((entry) => String(entry.userId) === split.user).percentage)
          : undefined,
      })),
    });

    return res.json({ message: "Expense updated successfully", expenseId: expense._id });
  } catch (error) {
    console.error("Error updating group expense:", error);
    return res.status(500).json({ error: "Could not update expense" });
  }
};

export const deleteGroupExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;
    if (!mongoose.isValidObjectId(groupId) || !mongoose.isValidObjectId(expenseId)) {
      return res.status(400).json({ error: "Invalid group or expense ID" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    const currentUserId = req.user.userId.toString();
    const member = group.members.find((entry) => entry.user.toString() === currentUserId);
    if (!member) return res.status(403).json({ error: "You are not a member of this group" });

    const expense = await Expense.findOne({ _id: expenseId, groupId: group._id });
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    const isGroupAdmin = member.role === "admin" || group.createdBy.toString() === currentUserId;
    const isExpenseOwner = expense.createdBy?.toString() === currentUserId || expense.paidBy.toString() === currentUserId;
    if (!isGroupAdmin && !isExpenseOwner) {
      return res.status(403).json({ error: "Only the expense creator, payer, or a group admin can delete it" });
    }

    const splitUsers = await User.find({ _id: { $in: expense.splitAmong.map((split) => split.user) } }).select("name");
    await recordGroupActivity(group._id, currentUserId, "expense_deleted", `deleted “${expense.description}” (${group.currency || "INR"} ${expense.amount.toFixed(2)})`, {
      expenseId: expense._id,
      description: expense.description,
      amount: expense.amount,
      splitBreakdown: expense.splitAmong.map((split) => ({
        name: splitUsers.find((user) => user._id.toString() === split.user.toString())?.name || "Unknown member",
        shareAmount: split.shareAmount,
        percentage: split.percentage,
      })),
    });
    await expense.deleteOne();
    return res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting group expense:", error);
    return res.status(500).json({ error: "Could not delete expense" });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { joinCode } = req.body;

    if (!joinCode?.trim()) {
      return res.status(400).json({ error: "Invite code is required" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const group = await Group.findOne({ joinCode: joinCode.trim().toUpperCase() });
    if (!group) {
      return res.status(404).json({ error: "Invalid invite code" });
    }

    const isMember = group.members.some(
      (m) => m.user.toString() === user._id.toString()
    );
    if (isMember) {
      return res
        .status(400)
        .json({ error: "You are already a member of this group" });
    }

    group.members.push({
      user: user._id,
      joinedAt: new Date(),
      role: "member",
    });

    await group.save();

    await recordGroupActivity(group._id, user._id, "member_joined", `joined the group`, {
      memberId: user._id,
      memberName: user.name,
    });

    res.status(200).json({ message: "Successfully joined the group", group });
  } catch (err) {
    console.error("❌ Error in joinGroup:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    if (!mongoose.isValidObjectId(groupId) || !mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({ error: "Invalid group or member ID" });
    }
    const group = await Group.findById(groupId).populate("members.user", "name username");
    if (!group) return res.status(404).json({ error: "Group not found" });
    const actorId = req.user.userId.toString();
    const actorMembership = group.members.find((entry) => entry.user?._id?.toString() === actorId || entry.user?.toString() === actorId);
    if (!actorMembership || (actorMembership.role !== "admin" && group.createdBy.toString() !== actorId)) {
      return res.status(403).json({ error: "Only group admins can remove members" });
    }
    if (group.createdBy.toString() === memberId) {
      return res.status(400).json({ error: "The group creator cannot be removed" });
    }
    const targetMembership = group.members.find((entry) => entry.user?._id?.toString() === memberId || entry.user?.toString() === memberId);
    if (!targetMembership) return res.status(404).json({ error: "Member not found in this group" });
    const hasFinancialHistory = await Promise.all([
      Expense.exists({ groupId: group._id, $or: [{ paidBy: memberId }, { "splitAmong.user": memberId }] }),
      Settlement.exists({ groupId: group._id, $or: [{ payer: memberId }, { payee: memberId }] }),
    ]).then((results) => results.some(Boolean));
    if (hasFinancialHistory) {
      return res.status(409).json({ error: "This member is part of existing expense or payment history. Keep them in the group so past balances and records remain accessible." });
    }
    const removedName = targetMembership.user?.name || "A member";
    group.members = group.members.filter((entry) => (entry.user?._id?.toString() || entry.user?.toString()) !== memberId);
    await group.save();
    await recordGroupActivity(group._id, actorId, "member_removed", `removed ${removedName} from the group`, {
      memberId,
      memberName: removedName,
    });
    return res.json({ message: `${removedName} was removed from the group` });
  } catch (error) {
    console.error("Error removing group member:", error);
    return res.status(500).json({ error: "Could not remove group member" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const member = group.members.find(
      (entry) => entry.user.toString() === req.user.userId
    );
    const isCreator = group.createdBy.toString() === req.user.userId;
    if (!isCreator && (!member || member.role !== "admin")) {
      return res.status(403).json({ error: "Only group admins can delete this group" });
    }

    await Promise.all([
      Expense.deleteMany({ groupId: group._id }),
      Settlement.deleteMany({ groupId: group._id }),
      GroupActivity.deleteMany({ groupId: group._id }),
      Notification.deleteMany({ groupId: group._id }),
    ]);
    await group.deleteOne();
    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error("Error deleting group:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({ recipient: userId })
      .populate("actor", "name")
      .populate("groupId", "name")
      .sort({ createdAt: -1 }).limit(20);
    const unseenCount = await Notification.countDocuments({ recipient: userId, readAt: null });
    res.status(200).json({ notifications, unseenCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

export const resetNotificationCount = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.userId, readAt: null },
      { $set: { readAt: new Date() } }
    );
    res.status(200).json({ message: "Notification count reset" });
  } catch (error) {
    console.error("Error resetting notifications:", error);
    res.status(500).json({ message: "Failed to reset notifications", error });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.notificationId)) return res.status(400).json({ error: "Invalid notification ID" });
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, recipient: req.user.userId },
      { $set: { readAt: new Date() } },
      { new: true },
    );
    if (!notification) return res.status(404).json({ error: "Notification not found" });
    return res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(500).json({ error: "Could not update notification" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("name email mobile username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const name = typeof req.body.name === "string" ? req.body.name.trim() : undefined;
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : undefined;
    const mobile = typeof req.body.mobile === "string" ? req.body.mobile.trim() : undefined;
    const username = typeof req.body.username === "string" ? req.body.username.trim() : undefined;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (mobile !== undefined) user.mobile = mobile;
    if (username !== undefined) user.username = username;

    try {
      await user.save();
    } catch (error) {
      if (error.code === 11000) {
        const duplicateField = error.keyPattern?.email ? "Email" : "Username";
        return res.status(409).json({ message: `${duplicateField} is already in use` });
      }
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Error updating profile",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (typeof currentPassword !== "string" || !currentPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ message: "Enter your current password and a new password with at least 6 characters" });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "Your new password must be different from the current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};
