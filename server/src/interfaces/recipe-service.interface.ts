import type { Recipe } from "@models/recipe.js";

export interface IRecipeService {
  findTrending(): Promise<Recipe[]>;
  findAll(
    limit?: number,
    offset?: number
  ): Promise<{ recipes: Recipe[]; totalCount: number }>;
  findById(id: string): Promise<Recipe | null>;
}
