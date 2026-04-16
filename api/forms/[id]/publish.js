import { connectDB } from "../../../lib/db";
import Form from "../../../lib/models/Form";
import { handleError, requireAuth } from "../../../lib/middleware";

export default async function handler(req, res) {
  try {
    if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });
    if (!requireAuth(req, res)) return;
    await connectDB();

    const form = await Form.findById(req.query.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    if (String(form.ownerId) !== req.user.userId) return res.status(403).json({ error: "Forbidden" });

    form.isPublished = !form.isPublished;
    await form.save();

    return res.status(200).json({ isPublished: form.isPublished });
  } catch (error) {
    return handleError(res, error);
  }
}
