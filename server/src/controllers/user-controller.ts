import type { User } from "@models/user.js";
import { userService } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Request, Response } from "express";

async function getCurrentUser(req: Request, res: Response): Promise<void> {
  if (!req.isAuthenticated())
    return sendSuccess(res, 200, null, "No user authenticated");

  const { password, ...safeUser } = req.user as User;
  sendSuccess(res, 200, safeUser, "User retrieved successfully");
}

async function getById(req: Request, res: Response): Promise<void> {
  const userId = req.validated?.params?.id as string;
  const user = await userService.getById(userId);

  sendSuccess(res, 200, user, "User retrieved successfully");
}

async function getCurrentUserPreferences(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const preferences = await userService.getPreferences(user.id);

  sendSuccess(res, 200, preferences, "User preferences retrieved successfully");
}

export const userController = {
  getById,
  getCurrentUser,
  getCurrentUserPreferences,
};
