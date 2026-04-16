import { Schema, model, type InferSchemaType } from "mongoose";

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
  "file",
  "rating"
] as const;

const fieldSchema = new Schema(
  {
    type: { type: String, enum: FIELD_TYPES, required: true },
    label: { type: String, required: true, trim: true },
    placeholder: { type: String, default: "" },
    helpText: { type: String, default: "" },
    required: { type: Boolean, default: false },
    order: { type: Number, required: true },
    options: { type: [String], default: [] },
    validation: {
      min: { type: Number, default: undefined },
      max: { type: Number, default: undefined },
      maxLength: { type: Number, default: undefined }
    }
  },
  { _id: true }
);

const formSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    slug: { type: String, required: true, unique: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    isPublished: { type: Boolean, default: false },
    requireLogin: { type: Boolean, default: false },
    allowSaveProgress: { type: Boolean, default: false },
    submitButtonLabel: { type: String, default: "Submit" },
    successMessage: { type: String, default: "Thanks for your response." },
    fields: { type: [fieldSchema], default: [] },
    responseCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

formSchema.index({ ownerId: 1, updatedAt: -1 });

export type FormDocument = InferSchemaType<typeof formSchema>;
export const FormModel = model("Form", formSchema);
