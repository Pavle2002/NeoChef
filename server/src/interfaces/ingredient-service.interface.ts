import type { Ingredient } from "@common/schemas/ingredient.js";

export interface IIngredientService {
  getAll(queryString?: string): Promise<Ingredient[]>;
}
