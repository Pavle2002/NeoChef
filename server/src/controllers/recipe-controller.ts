import type { RecipeFilters, RecipeSortOptions, User } from "@neochef/common";
import { recipeService, userService } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Request, Response } from "express";

async function getById(req: Request, res: Response): Promise<void> {
  const recipeId = req.validated?.params?.id as string;
  const user = req.user as User;
  const recipe = await recipeService.getByIdExtended(recipeId, user.id);
  sendSuccess(res, 200, recipe, "Recipe retrieved successfully");
}

async function getAll(req: Request, res: Response): Promise<void> {
  const limit = req.validated?.query?.limit as number;
  const offset = req.validated?.query?.offset as number;

  const filters = {
    cuisines: req.validated?.query?.cuisines,
    diets: req.validated?.query?.diets,
    dishTypes: req.validated?.query?.dishTypes,
  } as RecipeFilters;

  const sortOptions = {
    sortBy: req.validated?.query?.sortBy,
    sortOrder: req.validated?.query?.sortOrder,
  } as RecipeSortOptions;

  const recipes = await recipeService.getAll(
    limit,
    offset,
    filters,
    sortOptions
  );
  sendSuccess(res, 200, recipes, "Recipes retrieved successfully");
}

async function getTrending(req: Request, res: Response): Promise<void> {
  const recipes = await recipeService.getTrending();
  sendSuccess(res, 200, recipes, "Trending recipes retrieved successfully");
}

async function like(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  const recipeId = req.validated?.params?.id as string;

  await userService.toggleLikesRecipe(user.id, recipeId, true);
  sendSuccess(res, 200, null, "Recipe liked successfully");
}

async function unlike(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  const recipeId = req.validated?.params?.id as string;

  await userService.toggleLikesRecipe(user.id, recipeId, false);
  sendSuccess(res, 200, null, "Recipe unliked successfully");
}

async function save(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  const recipeId = req.validated?.params?.id as string;

  await userService.toggleSavedRecipe(user.id, recipeId, true);
  sendSuccess(res, 200, null, "Recipe saved successfully");
}

async function unsave(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  const recipeId = req.validated?.params?.id as string;

  await userService.toggleSavedRecipe(user.id, recipeId, false);
  sendSuccess(res, 200, null, "Recipe unsaved successfully");
}

export const recipeController = {
  getById,
  getAll,
  getTrending,
  like,
  unlike,
  save,
  unsave,
};
