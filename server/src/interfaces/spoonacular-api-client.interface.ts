import type { SpoonacularResult, SpoonacularSearchOptions } from "@app-types/spoonacular-types.js";

export interface ISpoonacularApiClient {
  searchRecipes(options: SpoonacularSearchOptions): Promise<SpoonacularResult[]>;
}