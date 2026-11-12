import mongoose from "mongoose";
import FinancialAccount from "../models/FinancialAccount.js";
import PersonalExpense from "../models/PersonalExpense.js";
import { ownedAccount, rebuildAccountLedger } from "../services/accountLedger.js";

const accountTypes = new Set(["bank", "credit_card", "upi_lite", "other"]);
const currencies = new Set(["INR", "USD", "EUR", "GBP"]);
const validAmount = (value, allowZero = false) => {
  const amount = Number(value);
  return Number.isFinite(amount) && (allowZero ? amount >= 0 : amount > 0) ? Math.round(amount * 100) / 100 : null;
};

export const getAccounts = async (req, res) => {
  try {
    const accounts = await FinancialAccount.find({ owner: req.user.userId }).sort({ createdAt: -1 }).lean();
    const result = await Promise.all(accounts.map(async (account) => {
      const expenses = await PersonalExpense.find({ owner: req.user.userId, $or: [{ account: account._id }, { transferAccount: account._id }] })
        .populate("account", "name type currency")
        .populate("transferAccount", "name type currency")
        .sort({ date: -1, time: -1, createdAt: -1 }).limit(20).lean();
      const history = expenses.map((expense) => {
        const isTransfer = expense.direction === "transfer";
        const isDestination = isTransfer && String(expense.transferAccount?._id) === String(account._id);
        const direction = isTransfer
          ? isDestination ? "credit" : "debit"
          : expense.direction || (["cashback", "salary"].includes(expense.category?.trim().toLowerCase()) ? "credit" : "debit");
        return {
          _id: expense._id,
          kind: isTransfer ? "transfer" : "expense",
          direction,
          description: isTransfer
            ? `${isDestination ? "Transfer from" : "Transfer to"} ${isDestination ? expense.account?.name : expense.transferAccount?.name}`
            : expense.description,
          amount: expense.amount,
          date: expense.date,
          time: expense.time || "00:00",
          balanceAfter: isDestination ? expense.transferBalanceAfter : expense.balanceAfter,
        };
      });
      history.sort((left, right) => new Date(right.date) - new Date(left.date));
      return { ...account, history };
    }));
    return res.json({ accounts: result });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return res.status(500).json({ error: "Could not load your accounts" });
  }
};

export const createAccount = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const type = req.body.type;
    const customTypeName = typeof req.body.customTypeName === "string" ? req.body.customTypeName.trim() : "";
    const currency = req.body.currency || "INR";
    const openingBalance = validAmount(req.body.openingBalance, true);
    if (!name || name.length > 60) return res.status(400).json({ error: "Enter an account name up to 60 characters" });
    if (!accountTypes.has(type)) return res.status(400).json({ error: "Choose a supported account type" });
    if (type === "other" && (!customTypeName || customTypeName.length > 40)) return res.status(400).json({ error: "Enter a custom account type up to 40 characters" });
    if (!currencies.has(currency)) return res.status(400).json({ error: "Choose a supported currency" });
    if (openingBalance === null) return res.status(400).json({ error: "Enter a valid opening balance" });

    const account = await FinancialAccount.create({
      owner: req.user.userId,
      name,
      type,
      customTypeName: type === "other" ? customTypeName : "",
      currency,
      openingBalance,
      currentBalance: openingBalance,
    });
    return res.status(201).json({ message: "Account created", account });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).json({ error: "Could not create this account" });
  }
};

export const updateAccount = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.accountId)) return res.status(400).json({ error: "Invalid account ID" });
    const account = await ownedAccount(req.params.accountId, req.user.userId);
    if (!account) return res.status(404).json({ error: "Account not found" });
    if (typeof req.body.name === "string") {
      const name = req.body.name.trim();
      if (!name || name.length > 60) return res.status(400).json({ error: "Enter an account name up to 60 characters" });
      account.name = name;
    }
    if (req.body.openingBalance !== undefined) {
      const openingBalance = validAmount(req.body.openingBalance, true);
      if (openingBalance === null) return res.status(400).json({ error: "Enter a valid opening balance" });
      account.openingBalance = openingBalance;
    }
    await account.save();
    const updatedAccount = await rebuildAccountLedger(account._id, req.user.userId);
    return res.json({ message: "Account updated", account: updatedAccount });
  } catch (error) {
    console.error("Error updating account:", error);
    return res.status(500).json({ error: "Could not update this account" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.accountId)) return res.status(400).json({ error: "Invalid account ID" });
    const account = await ownedAccount(req.params.accountId, req.user.userId);
    if (!account) return res.status(404).json({ error: "Account not found" });
    const transactionCount = await PersonalExpense.countDocuments({ owner: req.user.userId, $or: [{ account: account._id }, { transferAccount: account._id }] });
    if (transactionCount) return res.status(409).json({ error: "This account has transaction history and cannot be deleted" });
    await account.deleteOne();
    return res.json({ message: "Account deleted" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ error: "Could not delete this account" });
  }
};
