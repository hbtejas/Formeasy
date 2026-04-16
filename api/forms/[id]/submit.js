import { connectDB } from "../../../lib/db";
import Form from "../../../lib/models/Form";
import Response from "../../../lib/models/Response";
import { handleError } from "../../../lib/middleware";
import { verifyAccessToken } from "../../../lib/auth";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    await connectDB();

    const form = await Form.findById(req.query.id);
    if (!form || !form.isPublished) return res.status(404).json({ error: "Form not found" });

    let submittedBy = undefined;
    const auth = req.headers.authorization || "";
    if (auth.startsWith("Bearer ")) {
      try {
        const decoded = verifyAccessToken(auth.slice(7));
        submittedBy = decoded.userId;
      } catch {
        submittedBy = undefined;
      }
    }

    if (form.requireLogin && !submittedBy) {
      return res.status(401).json({ error: "Login required" });
    }

    const response = await Response.create({
      formId: form._id,
      submittedBy,
      data: req.body?.data || {},
      isPartial: Boolean(req.body?.isPartial)
    });

    if (!response.isPartial) {
      form.responseCount += 1;
      await form.save();
    }

    return res.status(201).json({ id: String(response._id), successMessage: form.successMessage });
  } catch (error) {
    return handleError(res, error);
  }
}
