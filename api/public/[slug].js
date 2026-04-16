import { connectDB } from "../../lib/db";
import Form from "../../lib/models/Form";
import { handleError } from "../../lib/middleware";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    await connectDB();

    const form = await Form.findOne({ slug: req.query.slug, isPublished: true }).lean();
    if (!form) return res.status(404).json({ error: "This form is not available" });

    delete form.ownerId;
    return res.status(200).json({ form });
  } catch (error) {
    return handleError(res, error);
  }
}
