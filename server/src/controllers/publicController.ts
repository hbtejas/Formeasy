import type { Request, Response } from "express";
import { FormModel } from "../models/Form";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const getPublicFormBySlug = asyncHandler(async (req: Request, res: Response) => {
  const form = await FormModel.findOne({ slug: req.params.slug, isPublished: true });
  if (!form) {
    throw new ApiError(404, "Form not found");
  }

  res.json({
    form: {
      id: String(form._id),
      title: form.title,
      description: form.description,
      slug: form.slug,
      isPublished: form.isPublished,
      requireLogin: form.requireLogin,
      submitButtonLabel: form.submitButtonLabel,
      successMessage: form.successMessage,
      fields: form.fields
        .sort((a, b) => a.order - b.order)
        .map((field) => ({
          id: String(field._id),
          type: field.type,
          label: field.label,
          placeholder: field.placeholder,
          helpText: field.helpText,
          required: field.required,
          options: field.options,
          validation: field.validation ?? {}
        }))
    }
  });
});
