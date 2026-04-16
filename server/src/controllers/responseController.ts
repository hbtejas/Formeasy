import type { Request, Response } from "express";
import { FormModel } from "../models/Form";
import { ResponseModel } from "../models/Response";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { buildResponsesCsv } from "../utils/csvExporter";

const getOwnedForm = async (formId: string, userId: string) => {
  const form = await FormModel.findById(formId);
  if (!form) {
    throw new ApiError(404, "Form not found");
  }

  if (String(form.ownerId) !== userId) {
    throw new ApiError(403, "Forbidden");
  }

  return form;
};

export const submitResponse = asyncHandler(async (req: Request, res: Response) => {
  const form = await FormModel.findById(req.params.id);
  if (!form || !form.isPublished) {
    throw new ApiError(404, "Form not found");
  }

  if (form.requireLogin && !req.user) {
    throw new ApiError(401, "Login required");
  }

  const response = await ResponseModel.create({
    formId: form._id,
    submittedBy: req.user?.userId,
    data: req.body.data,
    isPartial: Boolean(req.body.isPartial),
    submittedAt: new Date()
  });

  if (!response.isPartial) {
    form.responseCount += 1;
    await form.save();
  }

  res.status(201).json({
    id: String(response._id),
    successMessage: form.successMessage
  });
});

export const listResponses = asyncHandler(async (req: Request, res: Response) => {
  const formId = String(req.params.id);
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  await getOwnedForm(formId, req.user!.userId);

  const [items, total] = await Promise.all([
    ResponseModel.find({ formId, isPartial: false })
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ResponseModel.countDocuments({ formId, isPartial: false })
  ]);

  res.json({
    responses: items.map((item) => ({
      id: String(item._id),
      submittedAt: item.submittedAt,
      data: Object.fromEntries(item.data)
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

export const getSingleResponse = asyncHandler(async (req: Request, res: Response) => {
  const formId = String(req.params.id);
  const responseId = String(req.params.rid);
  await getOwnedForm(formId, req.user!.userId);

  const response = await ResponseModel.findOne({ _id: responseId, formId });
  if (!response) {
    throw new ApiError(404, "Response not found");
  }

  res.json({
    response: {
      id: String(response._id),
      submittedAt: response.submittedAt,
      data: Object.fromEntries(response.data)
    }
  });
});

export const exportCsv = asyncHandler(async (req: Request, res: Response) => {
  const formId = String(req.params.id);
  const form = await getOwnedForm(formId, req.user!.userId);
  const csv = await buildResponsesCsv(form);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${form.slug}-responses.csv`);
  res.send(csv);
});
