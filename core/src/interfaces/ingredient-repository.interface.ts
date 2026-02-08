import type {
  CanonicalIngredient,
  CanonicalIngredientData,
  Ingredient,
  IngredientData,
} from "@neochef/common";

export interface IIngredientRepository {
  findAll(queryString?: string): Promise<Ingredient[]>;
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
}
