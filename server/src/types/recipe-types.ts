import type { Recipe } from "@models/recipe.js";
import type { ExtendedIngredient } from "./ingredient-types.js";
import type { Cuisine } from "@models/cuisine.js";
import type { Diet } from "@models/diet.js";
import type { DishType } from "@models/dish-type.js";
import type { Equipment } from "@models/equipment.js";

export type RecipeData = Omit<Recipe, "id">;

export type ExtendedRecipe = {
  recipeData: RecipeData;
  extendedIngredients: ExtendedIngredient[];
  cuisines: Cuisine[];
  diets: Diet[];
  dishTypes: DishType[];
  equipment: Equipment[];
};

export type RecipeSearchOptions = {
  cuisine: string;
  diet: string;
  type: string;
  number: number;
  offset: number;
};
