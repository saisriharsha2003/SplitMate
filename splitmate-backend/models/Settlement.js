import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true, index: true },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true, min: 0.01 },
  currency: { type: String, enum: ["INR", "USD", "EUR", "GBP"], required: true },
  date: { type: Date, required: true, default: Date.now },
  note: { type: String, trim: true, maxlength: 240, default: "" },
}, { timestamps: true });

settlementSchema.index({ groupId: 1, date: -1 });
export default mongoose.model("Settlement", settlementSchema);
