import type { RecommendationMode, User } from "@neochef/common";
import { recommendationService } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Request, Response } from "express";

async function getRecommendedRecipes(
  req: Request,
  res: Response,
): Promise<void> {
  const user = req.user as User;
  const mode = req.validated?.query?.mode as RecommendationMode;
  const recipes = await recommendationService.getTopPicks(user.id, mode);
  sendSuccess(res, 200, recipes, "Recommended recipes retrieved successfully");
}

async function getSimilarToLastLiked(
  req: Request,
  res: Response,
): Promise<void> {
  const user = req.user as User;
  const mode = req.validated?.query?.mode as RecommendationMode;
  const result = await recommendationService.getSimilarToLastLiked(
    user.id,
    mode,
  );
  sendSuccess(res, 200, result, "Similar recipes retrieved successfully");
}

async function getFridgeBasedRecipes(
  req: Request,
  res: Response,
): Promise<void> {
  const user = req.user as User;
  const recipes = await recommendationService.getFridgeBased(user.id);
  sendSuccess(res, 200, recipes, "Fridge-based recipes retrieved successfully");
}

async function getSimilarityExplanation(
  req: Request,
  res: Response,
): Promise<void> {
  const recipe1Id = req.validated?.params?.id as string;
  const recipe2Id = req.validated?.params?.otherId as string;
  const explanation = await recommendationService.getSimilarityExplanation(
    recipe2Id,
    recipe1Id,
  );
  sendSuccess(
    res,
    200,
    explanation,
    "Recipe similarity explanation retrieved successfully",
  );
}

export const recommendationController = {
  getRecommendedRecipes,
  getFridgeBasedRecipes,
  getSimilarToLastLiked,
  getSimilarityExplanation,
};
