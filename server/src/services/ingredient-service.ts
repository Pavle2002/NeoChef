import type { IIngredientService } from "@interfaces/ingredient-service.interface.js";
import type { Ingredient } from "@neochef/common";
import type { IIngredientRepository } from "@neochef/core";

export class IngredientService implements IIngredientService {
  constructor(private readonly ingredientRepository: IIngredientRepository) {}

  async getAll(queryString = ""): Promise<Ingredient[]> {
    return this.ingredientRepository.findAll(queryString);
  }
}
