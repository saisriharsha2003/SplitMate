import FinancialAccount from "../models/FinancialAccount.js";
import PersonalExpense from "../models/PersonalExpense.js";

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const compareEvents = (left, right) =>
  new Date(left.date) - new Date(right.date)
  || String(left.time || "00:00").localeCompare(String(right.time || "00:00"))
  || new Date(left.createdAt) - new Date(right.createdAt)
  || String(left._id).localeCompare(String(right._id));

export const rebuildAccountLedger = async (accountId, ownerId) => {
  const account = await FinancialAccount.findOne({ _id: accountId, owner: ownerId });
  if (!account) return null;

  const expenses = await PersonalExpense.find({
    owner: ownerId,
    $or: [{ account: accountId }, { transferAccount: accountId }],
  }).sort({ date: 1, time: 1, createdAt: 1, _id: 1 });
  const events = expenses.map((document) => ({
    document,
    date: document.date,
    time: document.time,
    createdAt: document.createdAt,
    _id: document._id,
  })).sort(compareEvents);

  let balance = Number(account.openingBalance || 0);
  const isCreditCard = account.type === "credit_card";
  const expenseUpdates = [];
  for (const event of events) {
    const { document } = event;
    const isLegacyCreditCategory = ["cashback", "salary"].includes(document.category?.trim().toLowerCase());
    const isTransfer = document.direction === "transfer";
    const isDestination = isTransfer && String(document.transferAccount) === String(accountId);
    const isCredit = isTransfer ? isDestination : document.direction ? document.direction === "credit" : isLegacyCreditCategory;
    const increasesBalance = isCreditCard ? !isCredit : isCredit;
    const delta = Number(document.amount || 0) * (increasesBalance ? 1 : -1);
    balance = roundMoney(balance + delta);
    const balanceField = isDestination ? "transferBalanceAfter" : "balanceAfter";
    const update = { updateOne: { filter: { _id: document._id }, update: { $set: { [balanceField]: balance } } } };
    expenseUpdates.push(update);
  }

  if (expenseUpdates.length) await PersonalExpense.bulkWrite(expenseUpdates);
  account.currentBalance = roundMoney(balance);
  await account.save();
  return account;
};

export const ownedAccount = (accountId, ownerId) =>
  FinancialAccount.findOne({ _id: accountId, owner: ownerId });
