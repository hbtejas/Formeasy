import type { FieldType, FormField } from "@/types";

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

const randomSuffix = () => Math.random().toString(36).slice(2, 6);

export const generateSlug = (title: string) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return `${base || "untitled-form"}-${randomSuffix()}`;
};

export const createDefaultField = (type: FieldType, order: number): FormField => ({
  id: crypto.randomUUID(),
  type,
  label: "Untitled Field",
  placeholder: "",
  helpText: "",
  required: false,
  order,
  options: type === "select" || type === "multi_select" ? ["Option 1", "Option 2"] : [],
  validation: {}
});
