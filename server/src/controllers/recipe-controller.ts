import { NotFoundError } from "@errors/index.js";
import { recipeService } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Request, Response } from "express";

async function getById(req: Request, res: Response): Promise<void> {
  const recipeId = req.validated?.params?.id as string;
  const recipe = await recipeService.findById(recipeId);

  if (!recipe) {
    throw new NotFoundError(`Recipe with ID ${recipeId} not found`);
  }
  sendSuccess(res, 200, recipe, "Recipe retrieved successfully");
}

async function getAll(req: Request, res: Response): Promise<void> {
  const limit = req.validated?.query?.limit as number;
  const offset = req.validated?.query?.offset as number;

  const recipes = await recipeService.findAll(limit, offset);
  sendSuccess(res, 200, recipes, "Recipes retrieved successfully");
}

async function getTrending(req: Request, res: Response): Promise<void> {
  const recipes = await recipeService.findTrending();
  sendSuccess(res, 200, recipes, "Trending recipes retrieved successfully");
}

export const recipeController = {
  getById,
  getAll,
  getTrending,
};
