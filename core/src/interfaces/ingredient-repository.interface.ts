import type {
  CanonicalIngredient,
  CanonicalIngredientData,
  Ingredient,
  IngredientData,
} from "@neochef/common";

export interface IIngredientRepository {
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
  ): Promise<{ id: string; confidence: number }[]>;
}
