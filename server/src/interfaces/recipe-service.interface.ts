import type {
  Recipe,
  RecipeFilters,
  RecipeSortOptions,
} from "@common/schemas/recipe.js";

export interface IRecipeService {
  getById(id: string): Promise<Recipe>;
  getAll(
    limit?: number,
    offset?: number,
    filters?: RecipeFilters,
    sortOptions?: RecipeSortOptions
  ): Promise<{ recipes: Recipe[]; totalCount: number }>;
  getTrending(): Promise<Recipe[]>;
}
