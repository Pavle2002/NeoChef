import type { IngredientData } from "@app-types/ingredient-types.js";
import neo4jClient from "@config/neo4j.js";
import { InternalServerError } from "@errors/internal-server-error.js";
import type { IIngredientRepository } from "@interfaces/ingredient-repository.interface.js";
import type { Ingredient } from "@models/ingredient.js";

export class IngredientRepository implements IIngredientRepository {
  private neo4j = neo4jClient;

  async createOrUpdate(ingrediant: IngredientData): Promise<Ingredient> {
    const { spoonacularId, ...upsertIngredient } = ingrediant;
    const result = await this.neo4j.executeQuery(
      `MERGE (i:Ingredient {spoonacularId: $spoonacularId})
            ON CREATE SET i.id = apoc.create.uuid(), i += $upsertIngredient
            ON MATCH SET i += $upsertIngredient
            RETURN i`,
      { spoonacularId: ingrediant.spoonacularId, upsertIngredient }
    );

    const record = result.records[0];
    if (!record) {
      throw new InternalServerError("Failed to create or update ingredient");
    }
    return record.get("i").properties as Ingredient;
  }
}
