import type { Recipe } from "@common/schemas/recipe.js";

export interface IRecipeService {
  getById(id: string): Promise<Recipe>;
  getAll(
    limit?: number,
    offset?: number
  ): Promise<{ recipes: Recipe[]; totalCount: number }>;
  getTrending(): Promise<Recipe[]>;
}
