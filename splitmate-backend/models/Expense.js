import mongoose from "mongoose";

const ExpenseSplitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shareAmount: { type: Number, required: true },
  percentage: { type: Number, min: 0, max: 100 },
});

const expenseSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  splitType: { type: String, enum: ["equal", "percentage", "amount"], default: "equal" },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  splitAmong: [ExpenseSplitSchema],
  date: { type: Date, default: Date.now },
}, { timestamps: true });

expenseSchema.index({ groupId: 1, date: -1 });
expenseSchema.index({ paidBy: 1, date: -1 });
expenseSchema.index({ "splitAmong.user": 1, date: -1 });

export default mongoose.model("Expense", expenseSchema);
