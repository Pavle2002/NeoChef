import type { IIngredientService } from "@interfaces/ingredient-service.interface.js";
import type { CanonicalIngredient, Ingredient } from "@neochef/common";
import type { IIngredientRepository } from "@neochef/core";

export class IngredientService implements IIngredientService {
  constructor(private readonly ingredientRepository: IIngredientRepository) {}

  async getAllCanonical(queryString = ""): Promise<CanonicalIngredient[]> {
    return this.ingredientRepository.findAllCanonical(queryString);
  }

  async getAllUnmapped(): Promise<Ingredient[]> {
    return this.ingredientRepository.findAllUnmapped();
  }
}
