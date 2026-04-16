import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db";
import User from "../../lib/models/User";
import { handleError } from "../../lib/middleware";
import { setRefreshCookie, signAccessToken, signRefreshToken } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    await connectDB();

    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: "Missing required fields" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash });

    const payload = { userId: String(user._id), email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      accessToken,
      user: { id: String(user._id), name: user.name, email: user.email }
    });
  } catch (error) {
    return handleError(res, error);
  }
}
