import FinancialAccount from "../models/FinancialAccount.js";
import AccountEntry from "../models/AccountEntry.js";
import PersonalExpense from "../models/PersonalExpense.js";

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const compareEvents = (left, right) =>
  new Date(left.date) - new Date(right.date)
  || new Date(left.createdAt) - new Date(right.createdAt)
  || String(left._id).localeCompare(String(right._id));

export const rebuildAccountLedger = async (accountId, ownerId) => {
  const account = await FinancialAccount.findOne({ _id: accountId, owner: ownerId });
  if (!account) return null;

  const [expenses, entries] = await Promise.all([
    PersonalExpense.find({ owner: ownerId, account: accountId }).sort({ date: 1, createdAt: 1, _id: 1 }),
    AccountEntry.find({ owner: ownerId, account: accountId }).sort({ date: 1, createdAt: 1, _id: 1 }),
  ]);
  const events = [
    ...expenses.map((document) => ({ document, kind: "expense", date: document.date, createdAt: document.createdAt, _id: document._id })),
    ...entries.map((document) => ({ document, kind: "entry", date: document.date, createdAt: document.createdAt, _id: document._id })),
  ].sort(compareEvents);

  let balance = Number(account.openingBalance || 0);
  const isCreditCard = account.type === "credit_card";
  const expenseUpdates = [];
  const entryUpdates = [];
  for (const event of events) {
    const { document } = event;
    const isCashback = event.kind === "expense" && document.category?.trim().toLowerCase() === "cashback";
    const isCredit = event.kind === "entry" && document.direction === "credit";
    const increasesBalance = event.kind === "expense"
      ? isCreditCard !== isCashback
      : isCreditCard !== isCredit;
    const delta = Number(document.amount || 0) * (increasesBalance ? 1 : -1);
    balance = roundMoney(balance + delta);
    const update = { updateOne: { filter: { _id: document._id }, update: { $set: { balanceAfter: balance } } } };
    (event.kind === "expense" ? expenseUpdates : entryUpdates).push(update);
  }

  if (expenseUpdates.length) await PersonalExpense.bulkWrite(expenseUpdates);
  if (entryUpdates.length) await AccountEntry.bulkWrite(entryUpdates);
  account.currentBalance = roundMoney(balance);
  await account.save();
  return account;
};

export const ownedAccount = (accountId, ownerId) =>
  FinancialAccount.findOne({ _id: accountId, owner: ownerId });
