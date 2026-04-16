import { Schema, model, type InferSchemaType } from "mongoose";

const responseSchema = new Schema(
  {
    formId: { type: Schema.Types.ObjectId, ref: "Form", required: true, index: true },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    data: { type: Map, of: Schema.Types.Mixed, default: {} },
    isPartial: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

responseSchema.index({ formId: 1, submittedAt: -1 });

export type ResponseDocument = InferSchemaType<typeof responseSchema>;
export const ResponseModel = model("Response", responseSchema);
