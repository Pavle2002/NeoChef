import { recipeService } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Request, Response } from "express";

async function getById(req: Request, res: Response): Promise<void> {
  const recipeId = req.validated?.params?.id as string;
  const recipe = await recipeService.getById(recipeId);
  sendSuccess(res, 200, recipe, "Recipe retrieved successfully");
}

async function getAll(req: Request, res: Response): Promise<void> {
  const limit = req.validated?.query?.limit as number;
  const offset = req.validated?.query?.offset as number;

  const filters = {
    cuisines: req.validated?.query?.cuisines as string[] | undefined,
    diets: req.validated?.query?.diets as string[] | undefined,
    dishTypes: req.validated?.query?.dishTypes as string[] | undefined,
  };

  const recipes = await recipeService.getAll(limit, offset, filters);
  sendSuccess(res, 200, recipes, "Recipes retrieved successfully");
}

async function getTrending(req: Request, res: Response): Promise<void> {
  const recipes = await recipeService.getTrending();
  sendSuccess(res, 200, recipes, "Trending recipes retrieved successfully");
}

export const recipeController = {
  getById,
  getAll,
  getTrending,
};
