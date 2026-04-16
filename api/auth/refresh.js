import { parseCookies, signAccessToken, verifyRefreshToken } from "../../lib/auth";
import { handleError } from "../../lib/middleware";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const cookies = parseCookies(req);
    const token = cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = verifyRefreshToken(token);
    const accessToken = signAccessToken({ userId: decoded.userId, email: decoded.email });
    return res.status(200).json({ accessToken });
  } catch (error) {
    return handleError(res, error);
  }
}
