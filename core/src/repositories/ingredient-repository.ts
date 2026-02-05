import type {
  CanonicalIngredient,
  CanonicalIngredientData,
  Ingredient,
  IngredientData,
} from "@neochef/common";
import type { IIngredientRepository } from "../interfaces/ingredient-repository.interface.js";
import type { IQueryExecutor } from "../interfaces/query-executor.interface.js";
import { InternalServerError } from "../errors/internal-server-error.js";

export class IngredientRepository implements IIngredientRepository {
  constructor(private readonly queryExecutor: IQueryExecutor) {}

  async create(ingredient: IngredientData): Promise<Ingredient> {
    const { sourceName, sourceId, ...properties } = ingredient;
    const result = await this.queryExecutor.run(
      `MERGE (i:Ingredient {sourceName: $sourceName, sourceId: $sourceId})
       ON CREATE SET i.id = apoc.create.uuid(), i += $properties
       RETURN i`,
      { sourceName, sourceId, properties },
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
      { queryString },
    );

    const records = result.records;
    return records.map((record) => record.get("i").properties as Ingredient);
  }

  async createManyCanonical(
    ingredients: CanonicalIngredientData[],
  ): Promise<CanonicalIngredient[]> {
    if (!ingredients.length) return [];

    const results = await this.queryExecutor.run(
      `UNWIND $ingredients AS ingredient
       MERGE (parent:CanonicalIngredient {name: ingredient.name})
       ON CREATE SET parent.id = apoc.create.uuid(), parent.category = ingredient.category
       WITH parent, ingredient
       UNWIND coalesce(ingredient.versions, []) AS versionName
       MERGE (child:CanonicalIngredient {name: versionName})
       ON CREATE SET child.id = apoc.create.uuid(), child.category = ingredient.category
       MERGE (child)-[:IS_A]->(parent)
       RETURN parent, collect(child) AS children`,
      { ingredients },
    );

    const records = results.records;
    return records.map(
      (record) => record.get("parent").properties as CanonicalIngredient,
    );
  }
}
