// models/Expense.js (optional if you want a separate collection)
import mongoose from "mongoose";

const ExpenseSplitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shareAmount: { type: Number, required: true },
});

const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  splitAmong: [ExpenseSplitSchema],
  date: { type: Date, default: Date.now },
});

export default ExpenseSchema;
