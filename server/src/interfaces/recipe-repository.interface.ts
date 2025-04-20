import type { RecipeData } from "@app-types/recipe-types.js";
import type { Equipment } from "@models/equipment.js";
import type { Recipe } from "@models/recipe.js";
import type { Cuisine } from "@models/cuisine.js";
import type { Diet } from "@models/diet.js";
import type { DishType } from "@models/dish-type.js";
import type { ExtendedIngredient } from "@app-types/ingredient-types.js";

export interface IRecipeRepository {
  createOrUpdate(recipe: RecipeData): Promise<Recipe>;
  linkToIngredient(
    recipeId: string,
    ingredient: ExtendedIngredient
  ): Promise<void>;
  linkToEquipment(recipeId: string, equipment: Equipment): Promise<void>;
  linkToCuisine(recipeId: string, cuisine: Cuisine): Promise<void>;
  linkToDiet(recipeId: string, diet: Diet): Promise<void>;
  linkToDishType(recipeId: string, dishType: DishType): Promise<void>;
}
