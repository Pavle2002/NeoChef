import type { Ingredient } from "@common/schemas/ingredient.js";
import type { Preferences } from "@common/schemas/preferences.js";
import type { User } from "@common/schemas/user.js";
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

async function getCurrentUserFridge(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const fridge = await userService.getFridge(user.id);

  sendSuccess(res, 200, fridge, "User fridge retrieved successfully");
}

async function updateCurrentUserPreferences(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const newPreferences = req.validated?.body as Preferences;

  const updatedPreferences = await userService.updatePreferences(
    user.id,
    newPreferences
  );

  sendSuccess(
    res,
    200,
    updatedPreferences,
    "User preferences updated successfully"
  );
}

async function updateCurrentUserFridge(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const newIngredients = req.validated?.body as Ingredient[];

  const updatedFridge = await userService.updateFridge(user.id, newIngredients);

  sendSuccess(res, 200, updatedFridge, "User fridge updated successfully");
}

export const userController = {
  getById,
  getCurrentUser,
  getCurrentUserPreferences,
  getCurrentUserFridge,
  updateCurrentUserPreferences,
  updateCurrentUserFridge,
};
