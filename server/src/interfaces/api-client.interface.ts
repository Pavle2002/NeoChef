import type { RecipeSearchOptions } from "@app-types/import-types.js";
import type { ExtendedRecipe } from "@common/schemas/recipe.js";

export interface IApiClient {
  searchRecipes(options: RecipeSearchOptions): Promise<ExtendedRecipe[]>;
}
