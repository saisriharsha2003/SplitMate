import mongoose from "mongoose";

const personalExpenseSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  description: { type: String, required: true, trim: true, maxlength: 140 },
  amount: { type: Number, required: true, min: 0.01 },
  currency: { type: String, enum: ["INR", "USD", "EUR", "GBP"], default: "INR" },
  category: { type: String, trim: true, default: "Other", maxlength: 40 },
  date: { type: Date, required: true, default: Date.now },
  notes: { type: String, trim: true, default: "", maxlength: 500 },
}, { timestamps: true });

personalExpenseSchema.index({ owner: 1, date: -1 });

export default mongoose.model("PersonalExpense", personalExpenseSchema);
