import type { IngredientData } from "@app-types/ingredient-types.js";
import { InternalServerError } from "@errors/internal-server-error.js";
import type { IIngredientRepository } from "@interfaces/ingredient-repository.interface.js";
import type { IQueryExecutor } from "@interfaces/query-executor.interface.js";
import type { Ingredient } from "@models/ingredient.js";

export class IngredientRepository implements IIngredientRepository {
  constructor(private queryExecutor: IQueryExecutor) {}

  async createOrUpdate(ingrediant: IngredientData): Promise<Ingredient> {
    const { sourceId, sourceName, ...upsertIngredient } = ingrediant;
    const result = await this.queryExecutor.run(
      `MERGE (i:Ingredient {sourceName: $sourceName, sourceId: $sourceId})
            ON CREATE SET i.id = apoc.create.uuid(), i += $upsertIngredient
            ON MATCH SET i += $upsertIngredient
            RETURN i`,
      { sourceId, sourceName, upsertIngredient }
    );

    const record = result.records[0];
    if (!record) {
      throw new InternalServerError("Failed to create or update ingredient");
    }
    return record.get("i").properties as Ingredient;
  }

  async findAll(contains: string): Promise<Ingredient[]> {
    const result = await this.queryExecutor.run(
      `MATCH (i:Ingredient)
       WHERE i.name CONTAINS $contains
       RETURN i`,
      { contains }
    );

    const records = result.records;
    return records.map((record) => record.get("i").properties as Ingredient);
  }
}
