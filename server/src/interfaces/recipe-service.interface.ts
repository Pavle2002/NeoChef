import type {
  ExtendedRecipe,
  Recipe,
  RecipeFilters,
  RecipeSortOptions,
} from "@neochef/common";

export interface IRecipeService {
  getById(id: string): Promise<Recipe>;
  getByIdExtended(id: string, userId: string): Promise<ExtendedRecipe>;
  getAll(
    limit?: number,
    offset?: number,
    filters?: RecipeFilters,
    sortOptions?: RecipeSortOptions
  ): Promise<{ recipes: Recipe[]; totalCount: number }>;
  getTrending(): Promise<Recipe[]>;
}
