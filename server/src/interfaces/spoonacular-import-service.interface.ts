import type { SpoonacularSearchOptions } from "@app-types/spoonacular-types.js";
import type { Recipe } from "@models/recipe.js";

export interface ISpoonacularImportService {
  importRecipes(options: SpoonacularSearchOptions): Promise<Recipe[]>;
  importRecipesInBatches(batchSize: number): Promise<void>;
}
