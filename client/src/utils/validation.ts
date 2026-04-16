import { z } from "zod";
import type { FormField } from "@/types";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const buildDynamicFormSchema = (fields: FormField[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let schema: z.ZodTypeAny = z.any();

    switch (field.type) {
      case "short_text":
      case "long_text":
      case "rich_text":
      case "password":
        schema = z.string();
        if (field.validation.maxLength) {
          schema = (schema as z.ZodString).max(field.validation.maxLength);
        }
        break;
      case "email":
        schema = z.string().email("Invalid email");
        break;
      case "number":
        schema = z.coerce.number();
        if (field.validation.min !== undefined) {
          schema = (schema as z.ZodNumber).min(field.validation.min);
        }
        if (field.validation.max !== undefined) {
          schema = (schema as z.ZodNumber).max(field.validation.max);
        }
        break;
      case "switch":
        schema = z.boolean();
        break;
      case "multi_select":
        schema = z.array(z.string());
        break;
      case "date_range":
        schema = z.object({ start: z.string(), end: z.string() });
        break;
      case "file":
        schema = z.any();
        break;
      case "rating":
        schema = z.number().min(1).max(5);
        break;
      default:
        schema = z.string();
    }

    if (!field.required) {
      schema = schema.optional();
    }

    shape[field.id] = schema;
  });

  return z.object(shape);
};
