import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { TeamModel } from "../models/Team";
import { UserModel } from "../models/User";
import {
  attachRefreshCookie,
  clearRefreshCookie,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../services/tokenService";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const toUserDto = (user: { _id: unknown; name: string; email: string; role: "owner" | "member"; teamId?: unknown }) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  teamId: user.teamId ? String(user.teamId) : null
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const exists = await UserModel.findOne({ email: email.toLowerCase() });
  if (exists) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email: email.toLowerCase(), passwordHash, role: "owner" });

  const team = await TeamModel.create({
    name: `${name.split(" ")[0]}'s Team`,
    ownerId: user._id,
    members: [{ userId: user._id, role: "owner", invitedAt: new Date(), joinedAt: new Date() }]
  });

  user.teamId = team._id;
  await user.save();

  const payload = { userId: String(user._id), teamId: String(team._id), role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  attachRefreshCookie(res, refreshToken);

  res.status(201).json({ accessToken, refreshToken, user: toUserDto(user) });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const payload = {
    userId: String(user._id),
    teamId: user.teamId ? String(user.teamId) : undefined,
    role: user.role
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  attachRefreshCookie(res, refreshToken);

  res.json({ accessToken, refreshToken, user: toUserDto(user) });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  if (!refreshToken) {
    throw new ApiError(401, "Missing refresh token");
  }

  const payload = verifyRefreshToken(refreshToken);
  const accessToken = generateAccessToken({
    userId: payload.userId,
    teamId: payload.teamId,
    role: payload.role
  });

  res.json({ accessToken });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearRefreshCookie(res);
  res.status(204).send();
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await UserModel.findById(req.user.userId).select("name email role teamId");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({ user: toUserDto(user as unknown as { _id: unknown; name: string; email: string; role: "owner" | "member"; teamId?: unknown }) });
});
