export type User = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "member";
  teamId: string | null;
};

export type FieldType =
  | "short_text"
  | "long_text"
  | "number"
  | "email"
  | "password"
  | "select"
  | "multi_select"
  | "switch"
  | "date"
  | "datetime"
  | "date_range"
  | "time"
  | "rich_text"
  | "file"
  | "rating";

export type FieldValidation = {
  min?: number;
  max?: number;
  maxLength?: number;
};

export type FormField = {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  helpText: string;
  required: boolean;
  order: number;
  options: string[];
  validation: FieldValidation;
};

export type Form = {
  id: string;
  title: string;
  description: string;
  slug: string;
  ownerId: string;
  teamId: string | null;
  isPublished: boolean;
  requireLogin: boolean;
  allowSaveProgress: boolean;
  submitButtonLabel: string;
  successMessage: string;
  fields: FormField[];
  responseCount: number;
  createdAt: string;
  updatedAt: string;
};

export type FormResponse = {
  id: string;
  submittedAt: string;
  data: Record<string, unknown>;
};
