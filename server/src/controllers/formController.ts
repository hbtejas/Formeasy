import { customAlphabet } from "nanoid";
import type { Request, Response } from "express";
import slugify from "slugify";
import { FormModel, type FormDocument } from "../models/Form";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 4);

const ensureOwnership = async (formId: string, userId: string) => {
  const form = await FormModel.findById(formId);
  if (!form) {
    throw new ApiError(404, "Form not found");
  }

  if (String(form.ownerId) !== userId) {
    throw new ApiError(403, "Forbidden");
  }

  return form;
};

const generateSlug = async (title: string) => {
  const base = slugify(title || "untitled-form", { lower: true, strict: true, trim: true });
  let slug = `${base}-${nanoid()}`;

  while (await FormModel.exists({ slug })) {
    slug = `${base}-${nanoid()}`;
  }

  return slug;
};

const toDto = (form: FormDocument & { _id: unknown; createdAt: Date; updatedAt: Date }) => ({
  id: String(form._id),
  title: form.title,
  description: form.description,
  slug: form.slug,
  ownerId: String(form.ownerId),
  teamId: form.teamId ? String(form.teamId) : null,
  isPublished: form.isPublished,
  requireLogin: form.requireLogin,
  allowSaveProgress: form.allowSaveProgress,
  submitButtonLabel: form.submitButtonLabel,
  successMessage: form.successMessage,
  fields: form.fields.map((field) => ({
    id: String(field._id),
    type: field.type,
    label: field.label,
    placeholder: field.placeholder,
    helpText: field.helpText,
    required: field.required,
    order: field.order,
    options: field.options,
    validation: field.validation ?? {}
  })),
  responseCount: form.responseCount,
  createdAt: form.createdAt,
  updatedAt: form.updatedAt
});

export const listForms = asyncHandler(async (req: Request, res: Response) => {
  const forms = await FormModel.find({ ownerId: req.user?.userId }).sort({ updatedAt: -1 });
  res.json({ forms: forms.map((form) => toDto(form as unknown as FormDocument & { _id: unknown; createdAt: Date; updatedAt: Date })) });
});

export const createForm = asyncHandler(async (req: Request, res: Response) => {
  const title = (req.body.title as string) || "Untitled Form";
  const slug = await generateSlug(title);

  const form = await FormModel.create({
    title,
    description: "",
    slug,
    ownerId: req.user?.userId,
    teamId: req.user?.teamId,
    fields: [],
    successMessage: "Thanks for your response."
  });

  res.status(201).json({ form: toDto(form as unknown as FormDocument & { _id: unknown; createdAt: Date; updatedAt: Date }) });
});

export const getForm = asyncHandler(async (req: Request, res: Response) => {
  const formId = String(req.params.id);
  const form = await ensureOwnership(formId, req.user!.userId);
  res.json({ form: toDto(form as unknown as FormDocument & { _id: unknown; createdAt: Date; updatedAt: Date }) });
});

export const updateForm = asyncHandler(async (req: Request, res: Response) => {
  const formId = String(req.params.id);
  const form = await ensureOwnership(formId, req.user!.userId);

  const patch = req.body as Partial<FormDocument> & {
    fields?: Array<{
      id?: string;
      type: string;
      label: string;
      placeholder?: string;
      helpText?: string;
      required?: boolean;
      order: number;
      options?: string[];
      validation?: { min?: number; max?: number; maxLength?: number };
    }>;
  };

  if (typeof patch.title === "string") {
    form.title = patch.title;
  }

  if (typeof patch.description === "string") {
    form.description = patch.description;
  }

  if (typeof patch.slug === "string" && patch.slug !== form.slug) {
    const exists = await FormModel.exists({ slug: patch.slug, _id: { $ne: form._id } });
    if (exists) {
      throw new ApiError(409, "Slug already exists");
    }
    form.slug = patch.slug;
  }

  if (typeof patch.requireLogin === "boolean") {
    form.requireLogin = patch.requireLogin;
  }

  if (typeof patch.allowSaveProgress === "boolean") {
    form.allowSaveProgress = patch.allowSaveProgress;
  }

  if (typeof patch.submitButtonLabel === "string") {
    form.submitButtonLabel = patch.submitButtonLabel;
  }

  if (typeof patch.successMessage === "string") {
    form.successMessage = patch.successMessage;
  }

  if (Array.isArray(patch.fields)) {
    form.fields = patch.fields
      .map((field, index) => ({
        _id: field.id,
        type: field.type,
        label: field.label,
        placeholder: field.placeholder ?? "",
        helpText: field.helpText ?? "",
        required: field.required ?? false,
        order: field.order ?? index,
        options: field.options ?? [],
        validation: field.validation ?? {}
      }))
      .sort((a, b) => a.order - b.order) as FormDocument["fields"];
  }

  await form.save();

  res.json({ form: toDto(form as unknown as FormDocument & { _id: unknown; createdAt: Date; updatedAt: Date }) });
});

export const deleteForm = asyncHandler(async (req: Request, res: Response) => {
  const formId = String(req.params.id);
  const form = await ensureOwnership(formId, req.user!.userId);
  await form.deleteOne();
  res.status(204).send();
});

export const togglePublish = asyncHandler(async (req: Request, res: Response) => {
  const formId = String(req.params.id);
  const form = await ensureOwnership(formId, req.user!.userId);
  form.isPublished = !form.isPublished;
  await form.save();
  res.json({ isPublished: form.isPublished });
});

export const addField = asyncHandler(async (req: Request, res: Response) => {
  const formId = String(req.params.id);
  const form = await ensureOwnership(formId, req.user!.userId);
  const nextOrder = form.fields.length;

  form.fields.push({
    type: req.body.type,
    label: req.body.label ?? "Untitled field",
    placeholder: req.body.placeholder ?? "",
    helpText: req.body.helpText ?? "",
    required: Boolean(req.body.required),
    options: req.body.options ?? [],
    order: nextOrder,
    validation: req.body.validation ?? {}
  } as FormDocument["fields"][number]);

  await form.save();
  res.status(201).json({ form: toDto(form as unknown as FormDocument & { _id: unknown; createdAt: Date; updatedAt: Date }) });
});

export const updateField = asyncHandler(async (req: Request, res: Response) => {
  const formId = String(req.params.id);
  const fieldId = String(req.params.fid);
  const form = await ensureOwnership(formId, req.user!.userId);
  const field = form.fields.id(fieldId);

  if (!field) {
    throw new ApiError(404, "Field not found");
  }

  const patch = req.body;
  Object.assign(field, {
    label: patch.label ?? field.label,
    placeholder: patch.placeholder ?? field.placeholder,
    helpText: patch.helpText ?? field.helpText,
    required: patch.required ?? field.required,
    options: patch.options ?? field.options,
    validation: patch.validation ?? field.validation,
    order: patch.order ?? field.order
  });

  await form.save();
  res.json({ form: toDto(form as unknown as FormDocument & { _id: unknown; createdAt: Date; updatedAt: Date }) });
});

export const removeField = asyncHandler(async (req: Request, res: Response) => {
  const formId = String(req.params.id);
  const fieldId = String(req.params.fid);
  const form = await ensureOwnership(formId, req.user!.userId);
  const field = form.fields.id(fieldId);
  if (!field) {
    throw new ApiError(404, "Field not found");
  }

  field.deleteOne();
  form.fields = form.fields.map((f, index) => {
    f.order = index;
    return f;
  }) as FormDocument["fields"];
  await form.save();

  res.json({ form: toDto(form as unknown as FormDocument & { _id: unknown; createdAt: Date; updatedAt: Date }) });
});

export const reorderFields = asyncHandler(async (req: Request, res: Response) => {
  const formId = String(req.params.id);
  const form = await ensureOwnership(formId, req.user!.userId);
  const order = req.body.order as string[];

  if (!Array.isArray(order)) {
    throw new ApiError(400, "Invalid order payload");
  }

  const idToIndex = new Map(order.map((id, idx) => [id, idx]));
  form.fields.forEach((field, idx) => {
    field.order = idToIndex.get(String(field._id)) ?? idx;
  });

  form.fields = form.fields.sort((a, b) => a.order - b.order) as FormDocument["fields"];
  await form.save();

  res.json({ form: toDto(form as unknown as FormDocument & { _id: unknown; createdAt: Date; updatedAt: Date }) });
});

export const checkSlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = String(req.query.slug ?? "");
  const formId = String(req.query.formId ?? "");
  const exists = await FormModel.exists({ slug, _id: { $ne: formId || undefined } });
  res.json({ available: !exists });
});
