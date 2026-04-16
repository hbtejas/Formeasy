import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface UserTokenPayload extends JwtPayload {
      userId: string;
      teamId?: string;
      role: "owner" | "member";
    }

    interface Request {
      user?: UserTokenPayload;
    }
  }
}

export {};
