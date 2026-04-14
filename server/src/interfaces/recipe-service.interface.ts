import type {
  ExtendedRecipe,
  ExtendedRecipeData,
  Recipe,
  RecipeFilters,
  RecipeSortOptions,
  SimilarityExplanation,
} from "@neochef/common";

export interface IRecipeService {
  create(extendedRecipeData: ExtendedRecipeData): Promise<Recipe>;
  getById(id: string): Promise<Recipe>;
  getByIdExtended(id: string, userId: string): Promise<ExtendedRecipe>;
  getAll(
    limit?: number,
    offset?: number,
    filters?: RecipeFilters,
    sortOptions?: RecipeSortOptions,
    searchQuery?: string,
  ): Promise<{ recipes: Recipe[]; totalCount: number }>;
  getTrending(): Promise<Recipe[]>;
  getSimilarRecipes(id: string, limit: number): Promise<Recipe[]>;
  getSimilarityExplanation(
    id1: string,
    id2: string,
  ): Promise<SimilarityExplanation>;
}
