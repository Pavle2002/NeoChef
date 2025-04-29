import type { RecipeData } from "@app-types/recipe-types.js";
import type { Equipment } from "@models/equipment.js";
import type { Recipe } from "@models/recipe.js";
import type { Cuisine } from "@models/cuisine.js";
import type { Diet } from "@models/diet.js";
import type { DishType } from "@models/dish-type.js";
import type { IngredientUsage } from "@app-types/ingredient-types.js";

export interface IRecipeRepository {
  createOrUpdate(recipe: RecipeData): Promise<Recipe>;
  findById(id: string): Promise<Recipe | null>;
  addIngredient(
    recipeId: string,
    ingredientId: string,
    usage: IngredientUsage
  ): Promise<void>;
  addEquipment(recipeId: string, equipment: Equipment): Promise<void>;
  addCuisine(recipeId: string, cuisine: Cuisine): Promise<void>;
  addDiet(recipeId: string, diet: Diet): Promise<void>;
  addDishType(recipeId: string, dishType: DishType): Promise<void>;
}
