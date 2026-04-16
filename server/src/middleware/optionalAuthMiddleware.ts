import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/tokenService";

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.replace("Bearer ", "");
      req.user = verifyAccessToken(token);
    } catch {
      req.user = undefined;
    }
  }
  next();
};
