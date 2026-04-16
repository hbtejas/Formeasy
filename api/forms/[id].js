import { connectDB } from "../../lib/db";
import Form from "../../lib/models/Form";
import Response from "../../lib/models/Response";
import { handleError, requireAuth } from "../../lib/middleware";

export default async function handler(req, res) {
  try {
    if (!requireAuth(req, res)) return;
    await connectDB();

    const id = req.query.id;
    const form = await Form.findById(id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    if (String(form.ownerId) !== req.user.userId) return res.status(403).json({ error: "Forbidden" });

    if (req.method === "GET") {
      return res.status(200).json({ form });
    }

    if (req.method === "PATCH") {
      const patch = req.body || {};
      Object.assign(form, patch);
      if (Array.isArray(patch.fields)) {
        form.fields = patch.fields;
      }
      await form.save();
      return res.status(200).json({ form });
    }

    if (req.method === "DELETE") {
      await Response.deleteMany({ formId: form._id });
      await form.deleteOne();
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return handleError(res, error);
  }
}
