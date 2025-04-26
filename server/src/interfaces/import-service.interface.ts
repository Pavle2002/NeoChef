import type { Recipe } from "@models/recipe.js";
import type { RecipeSearchOptions } from "@app-types/recipe-types.js";

export interface IImportService {
  importRecipes(options: RecipeSearchOptions): Promise<Recipe[]>;
  importRecipesInBatches(batchSize: number): Promise<void>;
}
