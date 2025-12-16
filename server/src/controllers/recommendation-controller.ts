import type { User } from "@neochef/common";
import { recommendationService } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Request, Response } from "express";

async function getRecommendedRecipes(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const recipes = await recommendationService.getTopPicks(user.id);
  sendSuccess(res, 200, recipes, "Recommended recipes retrieved successfully");
}

async function getFridgeBasedRecipes(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const recipes = await recommendationService.getFridgeBased(user.id);
  sendSuccess(res, 200, recipes, "Fridge-based recipes retrieved successfully");
}

async function getSimilarToLastLiked(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const result = await recommendationService.getSimilarToLastLiked(user.id);
  sendSuccess(res, 200, result, "Similar recipes retrieved successfully");
}

export const recommendationController = {
  getRecommendedRecipes,
  getFridgeBasedRecipes,
  getSimilarToLastLiked,
};
