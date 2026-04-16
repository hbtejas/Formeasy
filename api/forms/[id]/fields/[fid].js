import { connectDB } from "../../../../lib/db";
import Form from "../../../../lib/models/Form";
import { handleError, requireAuth } from "../../../../lib/middleware";

export default async function handler(req, res) {
  try {
    if (!requireAuth(req, res)) return;
    await connectDB();

    const form = await Form.findById(req.query.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    if (String(form.ownerId) !== req.user.userId) return res.status(403).json({ error: "Forbidden" });

    const field = form.fields.id(req.query.fid);
    if (!field) return res.status(404).json({ error: "Field not found" });

    if (req.method === "PATCH") {
      Object.assign(field, req.body || {});
      await form.save();
      return res.status(200).json({ form });
    }

    if (req.method === "DELETE") {
      field.deleteOne();
      form.fields.forEach((f, i) => {
        f.order = i;
      });
      await form.save();
      return res.status(200).json({ form });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return handleError(res, error);
  }
}
