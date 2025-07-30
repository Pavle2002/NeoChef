import type { Ingredient, IngredientData } from "@common/schemas/ingredient.js";

export interface IIngredientRepository {
  findAll(contains?: string): Promise<Ingredient[]>;
  createOrUpdate(ingredient: IngredientData): Promise<Ingredient>;
}
