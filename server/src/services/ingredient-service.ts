import type { IIngredientService } from "@interfaces/ingredient-service.interface.js";
import type {
  CanonicalIngredient,
  Ingredient,
  MatchResult,
} from "@neochef/common";
import type { IIngredientRepository } from "@neochef/core";

export class IngredientService implements IIngredientService {
  constructor(private readonly ingredientRepository: IIngredientRepository) {}

  async getAllCanonical(queryString = ""): Promise<CanonicalIngredient[]> {
    return this.ingredientRepository.findAllCanonical(queryString);
  }

  async getAllUnmapped(): Promise<Ingredient[]> {
    return this.ingredientRepository.findAllUnmapped();
  }

  async getSimilarCanonical(
    ingredientId: string,
    limit = 5,
  ): Promise<MatchResult[]> {
    return this.ingredientRepository.findSimilarCanonical(ingredientId, limit);
  }

  async addCanonical(
    ingredientId: string,
    canonicalId: string,
    confidence: number,
  ): Promise<void> {
    await this.ingredientRepository.addCanonical(
      ingredientId,
      canonicalId,
      confidence,
    );
  }
}
