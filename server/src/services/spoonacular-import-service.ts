import type { IImportService } from "@interfaces/import-service.interface.js";
import type { IApiClient } from "@interfaces/api-client.interface.js";
import type { IRecipeRepository } from "@interfaces/recipe-repository.interface.js";
import type { RecipeSearchOptions } from "@app-types/recipe-types.js";
import type { Recipe } from "@models/recipe.js";
import type { IImportProgressManager } from "@interfaces/import-progress-manager.interface.js";
import { safeAwait } from "@utils/safe-await.js";
import { CUISINES, DIETS, DISH_TYPES } from "@utils/spoonacular-constants.js";

export class SpoonacularImportService implements IImportService {
  constructor(
    private spoonacularApiClient: IApiClient,
    private recipeRepository: IRecipeRepository,
    private importProgressManager: IImportProgressManager
  ) {}

  async importRecipes(options: RecipeSearchOptions): Promise<Recipe[]> {
    const results = await this.spoonacularApiClient.searchRecipes(options);
    const recipes: Recipe[] = [];

    for (const result of results) {
      const recipe = await this.recipeRepository.createOrUpdate(
        result.recipeData
      );

      await Promise.all([
        ...result.extendedIngredients.map((ingredient) =>
          this.recipeRepository.linkToIngredient(recipe.id, ingredient)
        ),
        ...result.cuisines.map((cuisine) =>
          this.recipeRepository.linkToCuisine(recipe.id, cuisine)
        ),
        ...result.diets.map((diet) =>
          this.recipeRepository.linkToDiet(recipe.id, diet)
        ),
        ...result.dishTypes.map((dishType) =>
          this.recipeRepository.linkToDishType(recipe.id, dishType)
        ),
        ...result.equipment.map((equipment) =>
          this.recipeRepository.linkToEquipment(recipe.id, equipment)
        ),
      ]);

      recipes.push(recipe);
    }
    return recipes;
  }

  async importRecipesInBatches(batchSize: number): Promise<void> {
    const progress = await this.importProgressManager.load();
    const { position, combinations } = progress;

    for (let i = position.cuisineIndex; i < CUISINES.length; i++) {
      const cuisine = CUISINES[i] as string;
      for (let j = position.dietIndex; j < DIETS.length; j++) {
        const diet = DIETS[j] as string;
        for (let k = position.dishTypeIndex; k < DISH_TYPES.length; k++) {
          const dishType = DISH_TYPES[k] as string;

          const combinationKey = `${cuisine}|${diet}|${dishType}`;
          const combinationProgress = combinations[combinationKey] || {
            offset: 0,
            done: false,
          };
          if (combinationProgress.done) continue;

          const searchOptions: RecipeSearchOptions = {
            cuisine,
            diet,
            type: dishType,
            number: batchSize,
            offset: combinationProgress.offset,
          };
          const [error, recipes] = await safeAwait(
            this.importRecipes(searchOptions)
          );

          if (error) {
            position.cuisineIndex = i;
            position.dietIndex = j;
            position.dishTypeIndex = k;
            await this.importProgressManager.save(progress);
            throw error;
          }

          combinationProgress.offset += recipes.length;
          combinationProgress.done = recipes.length < batchSize;
          combinations[combinationKey] = combinationProgress;
        }
        position.dishTypeIndex = 0;
      }
      position.dietIndex = 0;
    }
    position.cuisineIndex = 0;

    await this.importProgressManager.save(progress);
  }
}
