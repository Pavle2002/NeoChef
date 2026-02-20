import type {
  CanonicalIngredient,
  CanonicalIngredientData,
  Ingredient,
  IngredientData,
  MatchResult,
} from "@neochef/common";

export interface IIngredientRepository {
  findAllCanonical(queryString?: string): Promise<CanonicalIngredient[]>;
  findAllUnmapped(): Promise<Ingredient[]>;
  findSimilarCanonical(
    ingredientId: string,
    limit?: number,
  ): Promise<MatchResult[]>;
  // createCanonical(
  //   ingredient: CanonicalIngredientData,
  // ): Promise<CanonicalIngredient>;
  create(ingredient: IngredientData): Promise<Ingredient>;
  createManyCanonical(
    ingredients: CanonicalIngredientData[],
  ): Promise<CanonicalIngredient[]>;
  addCanonical(
    ingredientId: string,
    canonicalId: string,
    confidence: number,
  ): Promise<void>;
}
