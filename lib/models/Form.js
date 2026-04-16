import mongoose from "mongoose";

export const FIELD_TYPES = [
  "short_text",
  "long_text",
  "number",
  "email",
  "password",
  "select",
  "multi_select",
  "switch",
  "date",
  "datetime",
  "date_range",
  "time",
  "rich_text",
  "rating"
];

const FieldSchema = new mongoose.Schema({
  type: { type: String, enum: FIELD_TYPES, required: true },
  label: { type: String, default: "Untitled Field" },
  placeholder: String,
  helpText: String,
  required: { type: Boolean, default: false },
  order: Number,
  options: [String],
  validation: {
    min: Number,
    max: Number,
    maxLength: Number
  }
});

const FormSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Untitled Form" },
    description: String,
    slug: { type: String, unique: true, sparse: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, default: false },
    requireLogin: { type: Boolean, default: false },
    allowSaveProgress: { type: Boolean, default: false },
    submitButtonLabel: { type: String, default: "Submit" },
    successMessage: { type: String, default: "Thank you for your response!" },
    fields: [FieldSchema],
    responseCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Form || mongoose.model("Form", FormSchema);
