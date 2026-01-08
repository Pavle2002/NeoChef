import type { Ingredient, IngredientData } from "@neochef/common";

export interface IIngredientRepository {
  findAll(contains?: string): Promise<Ingredient[]>;
  create(ingredient: IngredientData): Promise<Ingredient>;
}
