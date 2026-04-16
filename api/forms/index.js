import { connectDB } from "../../lib/db";
import Form from "../../lib/models/Form";
import { handleError, requireAuth } from "../../lib/middleware";

function slugify(value) {
  return String(value || "untitled-form")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 6);
}

async function uniqueSlug(title) {
  const base = slugify(title);
  let slug = `${base}-${randomSuffix()}`;
  while (await Form.exists({ slug })) {
    slug = `${base}-${randomSuffix()}`;
  }
  return slug;
}

export default async function handler(req, res) {
  try {
    if (!requireAuth(req, res)) return;
    await connectDB();

    if (req.method === "GET") {
      const forms = await Form.find({ ownerId: req.user.userId }).sort({ updatedAt: -1 });
      return res.status(200).json({ forms });
    }

    if (req.method === "POST") {
      const title = req.body?.title || "Untitled Form";
      const form = await Form.create({
        title,
        description: "",
        slug: await uniqueSlug(title),
        ownerId: req.user.userId,
        fields: []
      });
      return res.status(201).json({ form });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return handleError(res, error);
  }
}
