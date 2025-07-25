import type { Recipe } from "@models/recipe.js";

export interface IRecipeService {
  getById(id: string): Promise<Recipe>;
  getAll(
    limit?: number,
    offset?: number
  ): Promise<{ recipes: Recipe[]; totalCount: number }>;
  getTrending(): Promise<Recipe[]>;
}
