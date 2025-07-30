import type { IImportService } from "@interfaces/import-service.interface.js";
import type { IApiClient } from "@interfaces/api-client.interface.js";
import type { Recipe } from "@common/schemas/recipe.js";
import type { IImportProgressManager } from "@interfaces/import-progress-manager.interface.js";
import { safeAwait } from "@utils/safe-await.js";
import { CUISINES, DIETS, DISH_TYPES } from "@utils/spoonacular-constants.js";
import type { IUnitOfWorkFactory } from "@interfaces/unit-of-work-factory.interface.js";
import type { RecipeSearchOptions } from "@app-types/import-types.js";

export class SpoonacularImportService implements IImportService {
  constructor(
    private spoonacularApiClient: IApiClient,
    private uowFactory: IUnitOfWorkFactory,
    private importProgressManager: IImportProgressManager
  ) {}

  async importRecipes(options: RecipeSearchOptions): Promise<Recipe[]> {
    const results = await this.spoonacularApiClient.searchRecipes(options);
    const recipes: Recipe[] = [];

    for (const result of results) {
      const recipe = await this.uowFactory.execute(async (uow) => {
        const recipe = await uow.recipes.createOrUpdate(result.recipeData);

        for (const extendedIngredient of result.extendedIngredients) {
          const ingredient = await uow.ingredients.createOrUpdate(
            extendedIngredient.ingredientData
          );
          await uow.recipes.addIngredient(
            recipe.id,
            ingredient.id,
            extendedIngredient.usage
          );
        }
        for (const cuisine of result.cuisines) {
          await uow.recipes.addCuisine(recipe.id, cuisine);
        }
        for (const diet of result.diets) {
          await uow.recipes.addDiet(recipe.id, diet);
        }
        for (const dishType of result.dishTypes) {
          await uow.recipes.addDishType(recipe.id, dishType);
        }
        for (const equipment of result.equipment) {
          await uow.recipes.addEquipment(recipe.id, equipment);
        }

        return recipe;
      });
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
