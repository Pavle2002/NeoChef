import type { RecipeSearchOptions } from "@app-types/import-types.js";
import type { ExtendedRecipeData } from "@neochef/common";

export interface IApiClient {
  searchRecipes(options: RecipeSearchOptions): Promise<ExtendedRecipeData[]>;
}
