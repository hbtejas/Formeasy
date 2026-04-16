import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db";
import User from "../../lib/models/User";
import { handleError } from "../../lib/middleware";
import { setRefreshCookie, signAccessToken, signRefreshToken } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    await connectDB();

    const { email, password } = req.body || {};
    const user = await User.findOne({ email: String(email || "").toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password || "", user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const payload = { userId: String(user._id), email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      accessToken,
      user: { id: String(user._id), name: user.name, email: user.email }
    });
  } catch (error) {
    return handleError(res, error);
  }
}
