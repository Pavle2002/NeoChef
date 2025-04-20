import type { ExtendedIngredient } from "@app-types/ingredient-types.js";
import type { Cuisine } from "@models/cuisine.js";
import type { Diet } from "@models/diet.js";
import type { DishType } from "@models/dish-type.js";
import type { Equipment } from "@models/equipment.js";
import type { RecipeData } from "@app-types/recipe-types.js";

export type SpoonacularSearchOptions = {
  cuisine: string;
  diet: string;
  type: string;
  number: number;
};

export type SpoonacularResult = {
  recipeData: RecipeData;
  extendedIngredients: ExtendedIngredient[];
  cuisines: Cuisine[];
  diets: Diet[];
  dishTypes: DishType[];
  equipment: Equipment[];
};
