import type { RecipeSearchOptions } from "@app-types/import-types.js";
import type { ExtendedRecipeData } from "@common/schemas/recipe.js";

export interface IApiClient {
  searchRecipes(options: RecipeSearchOptions): Promise<ExtendedRecipeData[]>;
}
