import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/tokenService";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
