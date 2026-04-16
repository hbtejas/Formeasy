import { connectDB } from "../../../lib/db";
import Form from "../../../lib/models/Form";
import { handleError, requireAuth } from "../../../lib/middleware";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    if (!requireAuth(req, res)) return;
    await connectDB();

    const form = await Form.findById(req.query.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    if (String(form.ownerId) !== req.user.userId) return res.status(403).json({ error: "Forbidden" });

    const field = req.body || {};
    form.fields.push({ ...field, order: form.fields.length });
    await form.save();

    return res.status(201).json({ form });
  } catch (error) {
    return handleError(res, error);
  }
}
