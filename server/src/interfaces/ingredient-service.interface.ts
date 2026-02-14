import type { CanonicalIngredient, Ingredient } from "@neochef/common";

export interface IIngredientService {
  getAllCanonical(queryString?: string): Promise<CanonicalIngredient[]>;
  getAllUnmapped(): Promise<Ingredient[]>;
  getSimilarCanonical(
    ingredientId: string,
    limit?: number,
  ): Promise<{ match: CanonicalIngredient; confidence: number }[]>;
}
