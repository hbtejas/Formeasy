import { connectDB } from "../../../../lib/db";
import Form from "../../../../lib/models/Form";
import Response from "../../../../lib/models/Response";
import { handleError, requireAuth } from "../../../../lib/middleware";

function toCsvValue(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return `"${String(text).replace(/"/g, '""')}"`;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    if (!requireAuth(req, res)) return;
    await connectDB();

    const form = await Form.findById(req.query.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    if (String(form.ownerId) !== req.user.userId) return res.status(403).json({ error: "Forbidden" });

    const responses = await Response.find({ formId: form._id, isPartial: false }).sort({ submittedAt: -1 });
    const headers = ["Submitted At", ...form.fields.map((f) => f.label)];
    const rows = responses.map((r) => {
      const cells = [toCsvValue(r.submittedAt.toISOString())];
      form.fields.forEach((field) => {
        const val = r.data?.get(String(field._id));
        cells.push(toCsvValue(val ?? ""));
      });
      return cells.join(",");
    });

    const csv = [headers.map(toCsvValue).join(","), ...rows].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${form.slug || "responses"}.csv`);
    return res.status(200).send(csv);
  } catch (error) {
    return handleError(res, error);
  }
}
