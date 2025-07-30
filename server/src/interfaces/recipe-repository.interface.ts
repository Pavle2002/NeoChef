import type { Equipment } from "@common/schemas/equipment.js";
import type { Recipe, RecipeData } from "@common/schemas/recipe.js";
import type { Cuisine } from "@common/schemas/cuisine.js";
import type { Diet } from "@common/schemas/diet.js";
import type { DishType } from "@common/schemas/dish-type.js";
import type { IngredientUsage } from "@common/schemas/ingredient.js";

export interface IRecipeRepository {
  createOrUpdate(recipe: RecipeData): Promise<Recipe>;
  findById(id: string): Promise<Recipe | null>;
  findAll(limit?: number, offset?: number): Promise<Recipe[]>;
  findTrending(): Promise<Recipe[]>;
  addIngredient(
    recipeId: string,
    ingredientId: string,
    usage: IngredientUsage
  ): Promise<void>;
  addEquipment(recipeId: string, equipment: Equipment): Promise<void>;
  addCuisine(recipeId: string, cuisine: Cuisine): Promise<void>;
  addDiet(recipeId: string, diet: Diet): Promise<void>;
  addDishType(recipeId: string, dishType: DishType): Promise<void>;
  countAll(): Promise<number>;
}
