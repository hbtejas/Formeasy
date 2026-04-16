import { connectDB } from "../../lib/db";
import Form from "../../lib/models/Form";
import { handleError, requireAuth } from "../../lib/middleware";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    if (!requireAuth(req, res)) return;
    await connectDB();

    const slug = String(req.query.slug || "").trim();
    const formId = String(req.query.formId || "").trim();
    if (!slug) return res.status(400).json({ error: "Missing slug" });

    const conflict = await Form.exists({ slug, ...(formId ? { _id: { $ne: formId } } : {}) });
    return res.status(200).json({ available: !conflict });
  } catch (error) {
    return handleError(res, error);
  }
}
