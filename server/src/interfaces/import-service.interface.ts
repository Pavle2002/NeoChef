import type { RecipeSearchOptions } from "@app-types/import-types.js";
import type { Recipe } from "@common/schemas/recipe.js";

export interface IImportService {
  importRecipes(options: RecipeSearchOptions): Promise<Recipe[]>;
  importRecipesInBatches(batchSize: number): Promise<void>;
}
