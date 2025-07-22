import type { IngredientData } from "@app-types/ingredient-types.js";
import type { Ingredient } from "@models/ingredient.js";

export interface IIngredientRepository {
  findAll(contains: string): Promise<Ingredient[]>;
  createOrUpdate(ingredient: IngredientData): Promise<Ingredient>;
}
