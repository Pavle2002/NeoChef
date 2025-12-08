import type { User } from "@common/schemas/user.js";
import { recommendationService } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Request, Response } from "express";

async function getRecommendedRecipes(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const recipes = await recommendationService.getRecommendedRecipes(user.id);
  sendSuccess(res, 200, recipes, "Recommended recipes retrieved successfully");
}

export const recommendationController = { getRecommendedRecipes };
