import type {
  CanonicalIngredient,
  CanonicalIngredientData,
  Ingredient,
  IngredientData,
} from "@neochef/common";

export interface IIngredientRepository {
  findAllUnmapped(): Promise<Ingredient[]>;
  findAllCanonical(queryString?: string): Promise<CanonicalIngredient[]>;
  create(ingredient: IngredientData): Promise<Ingredient>;
  createManyCanonical(
    ingredients: CanonicalIngredientData[],
  ): Promise<CanonicalIngredient[]>;
  addCanonical(
    ingredientId: string,
    canonicalId: string,
    confidence: number,
  ): Promise<void>;
  findSimilarCanonical(
    embedding: number[],
    limit?: number,
  ): Promise<{ match: CanonicalIngredient; confidence: number }[]>;
}
