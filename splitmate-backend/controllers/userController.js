import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import Group from "../models/Groups.js";
import Expense from "../models/Expense.js";
import GroupActivity from "../models/GroupActivity.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const recordGroupActivity = (groupId, actor, action, message, details = {}) =>
  GroupActivity.create({ groupId, actor, action, message, details });

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
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const resetCode = crypto.randomInt(100000, 999999).toString();
    const hashedCode = await bcrypt.hash(resetCode, 10);

    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendResetEmail(email, resetCode);

    res.json({ message: "Verification code sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Verification code not sent" });
  }
};

export const verifyCode = async (req, res) => {
  const { reset_email, code } = req.body;
  console.log(reset_email);
  console.log(code);
  try {
    const user = await User.findOne({ email: reset_email });
    if (!user || !user.resetPasswordCode)
      return res.status(400).json({ error: "Invalid request" });

    const isMatch = await bcrypt.compare(code, user.resetPasswordCode);
    if (!isMatch || Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    res.json({ message: "Code verified, proceeding to update password" });
  } catch (error) {
    res.status(500).json({ error: "Error verifying code" });
  }
};

export const newPassword = async (req, res) => {
  const { reset_email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email: reset_email });
    if (!user) return res.status(400).json({ error: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
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

    const expenses = await Expense.find({ groupId: group._id })
      .populate("paidBy", "name username email")
      .populate("createdBy", "name username email")
      .populate("lastUpdatedBy", "name username email")
      .populate("splitAmong.user", "name username email")
      .sort({ date: -1, createdAt: -1 });
    const activity = await GroupActivity.find({ groupId: group._id })
      .populate("actor", "name username")
      .sort({ createdAt: -1 })
      .limit(100);

    let youOwe = 0;
    let owedToYou = 0;

    expenses.forEach((exp) => {
      const paidBy = exp.paidBy?._id?.toString();
      const currentUser = userId.toString();
      const userSplit = exp.splitAmong.find(
        (split) => split.user?._id?.toString() === currentUser || split.user?.toString() === currentUser
      );
      const userShare = userSplit
        ? userSplit.shareAmount ?? exp.amount / exp.splitAmong.length
        : 0;

      if (paidBy === currentUser) {
        owedToYou += exp.amount - userShare;
      } else {
        youOwe += userShare;
      }
    });

    const result = {
      _id: group._id,
      name: group.name,
      createdBy: group.createdBy,
      members: group.members,
      activity,
      currency: group.currency,
      joinCode: group.joinCode,
      expenses,
      summary: {
        youOwe,
        owedToYou,
      },
    };

    res.json(result);
  } catch (err) {
    console.error("❌ Error in getGroupById:", err.message);
    res.status(500).json({ error: "Server error" });
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
      participants: splitAmong.map((split) => ({ user: split.user, shareAmount: split.shareAmount, percentage: split.percentage })),
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
    const affectedIds = [...new Set([...addedIds, ...removedIds, ...changedShares.map((split) => split.user)])];
    const affectedPeople = affectedIds.length ? await User.find({ _id: { $in: affectedIds } }).select("name") : [];
    const personName = (userId) => affectedPeople.find((person) => person._id.toString() === userId)?.name || "A member";
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

    await recordGroupActivity(group._id, currentUserId, "expense_deleted", `deleted “${expense.description}” (${group.currency || "INR"} ${expense.amount.toFixed(2)})`, {
      expenseId: expense._id,
      description: expense.description,
      amount: expense.amount,
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

    await Expense.deleteMany({ groupId: group._id });
    await group.deleteOne();
    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error("Error deleting group:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getNotifications = async (req, res) => {
  console.log("Fetching notifications for user:", req.params.username);
  const { username } = req.params;
  try {
    const notifications = await Notification.find({
      recipients: username,
    }).sort({ createdAt: -1 });

    const unseenCount = notifications.filter(
      (n) => !n.seenBy.includes(username)
    ).length;

    res.status(200).json({ notifications, unseenCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

export const resetNotificationCount = async (req, res) => {
  const { username } = req.params;
  try {
    await Notification.updateMany(
      { recipients: username },
      { $addToSet: { seenBy: username } }
    );
    res.status(200).json({ message: "Notification count reset" });
  } catch (error) {
    console.error("Error resetting notifications:", error);
    res.status(500).json({ message: "Failed to reset notifications", error });
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
    const { username } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
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
