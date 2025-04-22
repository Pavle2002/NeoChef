import type { ISpoonacularImportService } from "@interfaces/spoonacular-import-service.interface.js";
import type { ISpoonacularApiClient } from "@interfaces/spoonacular-api-client.interface.js";
import type { IRecipeRepository } from "@interfaces/recipe-repository.interface.js";
import type { SpoonacularSearchOptions } from "@app-types/spoonacular-types.js";
import type { Recipe } from "@models/recipe.js";

export class SpoonacularImportService implements ISpoonacularImportService {
  constructor(
    private spoonacularApiClient: ISpoonacularApiClient,
    private recipeRepository: IRecipeRepository
  ) {}

  async importRecipes(options: SpoonacularSearchOptions): Promise<Recipe[]> {
    const results = await this.spoonacularApiClient.searchRecipes(options);
    const recipes: Recipe[] = [];

    for (const result of results) {
      const recipe = await this.recipeRepository.createOrUpdate(
        result.recipeData
      );

      for (const ingredient of result.extendedIngredients) {
        await this.recipeRepository.linkToIngredient(recipe.id, ingredient);
      }

      for (const cuisine of result.cuisines) {
        await this.recipeRepository.linkToCuisine(recipe.id, cuisine);
      }

      for (const diet of result.diets) {
        await this.recipeRepository.linkToDiet(recipe.id, diet);
      }

      for (const dishType of result.dishTypes) {
        await this.recipeRepository.linkToDishType(recipe.id, dishType);
      }

      for (const equipment of result.equipment) {
        await this.recipeRepository.linkToEquipment(recipe.id, equipment);
      }

      recipes.push(recipe);
    }

    return recipes;
  }

  async importRecipeById(spoonacularId: string): Promise<Recipe> {
    throw new Error("Method not implemented");
  }
}
