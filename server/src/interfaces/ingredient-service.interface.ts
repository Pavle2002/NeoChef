import type {
  CanonicalIngredient,
  Ingredient,
  MatchResult,
} from "@neochef/common";

export interface IIngredientService {
  getAllCanonical(queryString?: string): Promise<CanonicalIngredient[]>;
  getAllUnmapped(): Promise<Ingredient[]>;
  getSimilarCanonical(
    ingredientId: string,
    limit?: number,
  ): Promise<MatchResult[]>;
  addCanonical(
    ingredientId: string,
    canonicalId: string,
    confidence: number,
  ): Promise<void>;
}
