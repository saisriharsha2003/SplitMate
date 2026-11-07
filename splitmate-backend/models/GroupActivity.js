import mongoose from "mongoose";

const groupActivitySchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true, index: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  message: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

groupActivitySchema.index({ groupId: 1, createdAt: -1 });

export default mongoose.model("GroupActivity", groupActivitySchema);
