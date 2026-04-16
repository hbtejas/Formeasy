import { connectDB } from "../../lib/db";
import User from "../../lib/models/User";
import { handleError, requireAuth } from "../../lib/middleware";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    if (!requireAuth(req, res)) return;
    await connectDB();

    const user = await User.findById(req.user.userId).select("name email");
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ user: { id: String(user._id), name: user.name, email: user.email } });
  } catch (error) {
    return handleError(res, error);
  }
}
