import jwt from "jsonwebtoken";
import type { Response } from "express";

type TokenPayload = {
  userId: string;
  teamId?: string;
  role: "owner" | "member";
};

const getAccessSecret = () => process.env.JWT_SECRET ?? "";
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET ?? "";
const getAccessExpiresIn = () => process.env.JWT_EXPIRES_IN ?? "15m";
const getRefreshExpiresIn = () => process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";

export const generateAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, getAccessSecret(), { expiresIn: getAccessExpiresIn() as jwt.SignOptions["expiresIn"] });

export const generateRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, getRefreshSecret(), { expiresIn: getRefreshExpiresIn() as jwt.SignOptions["expiresIn"] });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, getAccessSecret()) as Express.UserTokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, getRefreshSecret()) as Express.UserTokenPayload;

export const attachRefreshCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie("refreshToken");
};
