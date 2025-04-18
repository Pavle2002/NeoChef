import type { IngrediantData } from "@app-types/ingrediant-types.js";
import neo4jClient from "@config/neo4j.js";
import { InternalServerError } from "@errors/internal-server-error.js";
import type { IIngredientRepository } from "@interfaces/ingrediant-repository.interface.js";
import type { Ingrediant } from "@models/ingrediant.js";

export class IngredientRepository implements IIngredientRepository {
  private neo4j = neo4jClient;

  async createOrUpdate(ingrediant: IngrediantData): Promise<Ingrediant> {
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
    return record.get("i").properties as Ingrediant;
  }
}
