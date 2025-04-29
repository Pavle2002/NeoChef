import type { Ingredient } from "@models/ingredient.js";

export type IngredientData = Omit<Ingredient, "id">;

export type IngredientUsage = {
  amount: number;
  unit: string;
  original: string;
};

export type ExtendedIngredient = {
  ingredientData: IngredientData;
  usage: IngredientUsage;
};
