import mongoose from "mongoose";

const financialAccountSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 60 },
  type: { type: String, enum: ["bank", "credit_card", "upi_lite", "other"], required: true },
  customTypeName: { type: String, trim: true, maxlength: 40, default: "" },
  currency: { type: String, enum: ["INR", "USD", "EUR", "GBP"], default: "INR" },
  openingBalance: { type: Number, required: true, min: 0 },
  currentBalance: { type: Number, default: 0 },
}, { timestamps: true });

financialAccountSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.model("FinancialAccount", financialAccountSchema);
