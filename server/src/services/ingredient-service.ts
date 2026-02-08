import type { IIngredientService } from "@interfaces/ingredient-service.interface.js";
import type { CanonicalIngredient } from "@neochef/common";
import type { IIngredientRepository } from "@neochef/core";

export class IngredientService implements IIngredientService {
  constructor(private readonly ingredientRepository: IIngredientRepository) {}

  async getAll(queryString = ""): Promise<CanonicalIngredient[]> {
    return this.ingredientRepository.findAllCanonical(queryString);
  }
}
