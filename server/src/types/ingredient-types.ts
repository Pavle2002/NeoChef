import type { Ingredient } from "@models/ingredient.js";

export type IngredientData = Omit<Ingredient, "id">;

export type ExtendedIngredient = {
  ingredientData: IngredientData;
  amount: number;
  unit: string;
};
