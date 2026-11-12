import mongoose from "mongoose";

const accountEntrySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "FinancialAccount", required: true, index: true },
  direction: { type: String, enum: ["credit", "debit"], required: true },
  description: { type: String, trim: true, maxlength: 140, default: "" },
  amount: { type: Number, required: true, min: 0.01 },
  date: { type: Date, required: true, default: Date.now },
  balanceAfter: { type: Number, default: 0 },
}, { timestamps: true });

accountEntrySchema.index({ account: 1, date: 1, createdAt: 1 });

export default mongoose.model("AccountEntry", accountEntrySchema);
