import type {
  CanonicalIngredient,
  CanonicalIngredientData,
  Ingredient,
  IngredientData,
} from "@neochef/common";

export interface IIngredientRepository {
  findAll(contains?: string): Promise<Ingredient[]>;
  findAllCanonical(): Promise<CanonicalIngredient[]>;
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
