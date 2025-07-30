import type { IIngredientRepository } from "@interfaces/ingredient-repository.interface.js";
import type { IIngredientService } from "@interfaces/ingredient-service.interface.js";
import type { Ingredient } from "@common/schemas/ingredient.js";

export class IngredientService implements IIngredientService {
  constructor(private ingredientRepository: IIngredientRepository) {}

  async getAll(queryString = ""): Promise<Ingredient[]> {
    return this.ingredientRepository.findAll(queryString);
  }
}
