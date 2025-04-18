import type { IngrediantData } from "@app-types/ingrediant-types.js";
import type { Ingrediant } from "@models/ingrediant.js";

export interface IIngredientRepository {
  createOrUpdate(ingrediant: IngrediantData): Promise<Ingrediant>;
}
