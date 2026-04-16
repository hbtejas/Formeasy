import { connectDB } from "../../../../lib/db";
import Form from "../../../../lib/models/Form";
import Response from "../../../../lib/models/Response";
import { handleError, requireAuth } from "../../../../lib/middleware";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    if (!requireAuth(req, res)) return;
    await connectDB();

    const form = await Form.findById(req.query.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    if (String(form.ownerId) !== req.user.userId) return res.status(403).json({ error: "Forbidden" });

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);

    const [responses, total] = await Promise.all([
      Response.find({ formId: form._id, isPartial: false })
        .sort({ submittedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Response.countDocuments({ formId: form._id, isPartial: false })
    ]);

    return res.status(200).json({
      responses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
      }
    });
  } catch (error) {
    return handleError(res, error);
  }
}
