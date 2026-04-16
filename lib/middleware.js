import { verifyAccessToken } from "./auth";

export function requireAuth(req, res) {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return false;
    }
    const token = auth.slice(7);
    req.user = verifyAccessToken(token);
    return true;
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
}

export function handleError(res, error) {
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({ error: error.message || "Server error" });
}
