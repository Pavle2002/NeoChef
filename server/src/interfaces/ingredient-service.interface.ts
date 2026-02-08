import type { CanonicalIngredient } from "@neochef/common";

export interface IIngredientService {
  getAll(queryString?: string): Promise<CanonicalIngredient[]>;
}
