import { InternalServerError } from "@errors/internal-server-error.js";
import type { IIngredientRepository } from "@interfaces/ingredient-repository.interface.js";
import type { IQueryExecutor } from "@interfaces/query-executor.interface.js";
import type { Ingredient, IngredientData } from "@neochef/common";

export class IngredientRepository implements IIngredientRepository {
  constructor(private readonly queryExecutor: IQueryExecutor) {}

  async create(ingrediant: IngredientData): Promise<Ingredient> {
    const { sourceName, sourceId, ...properties } = ingrediant;
    const result = await this.queryExecutor.run(
      `MERGE (i:Ingredient {sourceName: $sourceName, sourceId: $sourceId})
       ON CREATE SET i.id = apoc.create.uuid(), i += $properties
       RETURN i`,
      { sourceName, sourceId, properties }
    );

    const record = result.records[0];
    if (!record) {
      throw new InternalServerError("Failed to create ingredient");
    }
    return record.get("i").properties as Ingredient;
  }

  async findAll(queryString = ""): Promise<Ingredient[]> {
    const result = await this.queryExecutor.run(
      `MATCH (i:Ingredient)
       WHERE toLower(i.name) CONTAINS toLower($queryString)
         AND size(split(i.name, ' ')) <= 4
       RETURN i`,
      { queryString }
    );

    const records = result.records;
    return records.map((record) => record.get("i").properties as Ingredient);
  }
}
