import type { IngredientData } from "@app-types/ingredient-types.js";
import type { Ingredient } from "@models/ingredient.js";

export interface IIngredientRepository {
  createOrUpdate(ingredient: IngredientData): Promise<Ingredient>;
}
