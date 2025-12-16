import type { Ingredient } from "@neochef/common";

export interface IIngredientService {
  getAll(queryString?: string): Promise<Ingredient[]>;
}
