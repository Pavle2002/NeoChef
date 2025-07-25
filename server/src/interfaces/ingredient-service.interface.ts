import type { Ingredient } from "@models/ingredient.js";

export interface IIngredientService {
  getAll(queryString?: string): Promise<Ingredient[]>;
}
