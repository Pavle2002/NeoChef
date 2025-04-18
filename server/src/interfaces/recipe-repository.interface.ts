import type { RecipeData } from "@app-types/recipe-types.js";
import type { Equipment } from "@models/equipment.js";
import type { Recipe } from "@models/recipe.js";
import type { Cuisine } from "@models/cuisine.js";
import type { Diet } from "@models/diet.js";
import type { MealType } from "@models/meal-type.js";

export interface IRecipeRepository {
  createOrUpdate(recipe: RecipeData): Promise<Recipe>;
  linkToEquipment(recipeId: string, equipment: Equipment): Promise<void>;
  linkToCuisine(recipeId: string, cuisine: Cuisine): Promise<void>;
  linkToDiet(recipeId: string, diet: Diet): Promise<void>;
  linkToMealType(recipeId: string, mealType: MealType): Promise<void>;
}
