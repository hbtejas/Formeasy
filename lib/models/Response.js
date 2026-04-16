import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  data: { type: Map, of: mongoose.Schema.Types.Mixed },
  isPartial: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Response || mongoose.model("Response", ResponseSchema);
