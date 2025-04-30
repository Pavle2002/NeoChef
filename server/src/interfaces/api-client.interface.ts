import type {
  ExtendedRecipe,
  RecipeSearchOptions,
} from "@app-types/recipe-types.js";

export interface IApiClient {
  searchRecipes(options: RecipeSearchOptions): Promise<ExtendedRecipe[]>;
}
