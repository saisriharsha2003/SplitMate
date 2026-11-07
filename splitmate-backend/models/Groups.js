import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    currency: { type: String, default: "INR" },
    balance: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        joinedAt: { type: Date, default: Date.now },
        role: { type: String, enum: ["admin", "member"], default: "member" },
      },
    ],
    isActive: { type: Boolean, default: true },
    joinCode: { type: String, required: true, unique: true }, 
  },
  { timestamps: true }
);

groupSchema.index({ name: 1, createdBy: 1 }, { unique: true });

export default mongoose.model("Group", groupSchema);
