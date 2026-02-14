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

  async createManyCanonical(
    ingredients: CanonicalIngredientData[],
  ): Promise<CanonicalIngredient[]> {
    if (!ingredients.length) return [];

    const results = await this.queryExecutor.run(
      `UNWIND $ingredients AS ingredient
       MERGE (parent:CanonicalIngredient {name: ingredient.name})
       ON CREATE SET parent.id = apoc.create.uuid(), parent.category = ingredient.category, parent.embedding = ingredient.embedding
       WITH parent, ingredient
       UNWIND coalesce(ingredient.versions, []) AS version
       MERGE (child:CanonicalIngredient {name: version.name})
       ON CREATE SET child.id = apoc.create.uuid(), child.category = ingredient.category, child.embedding = version.embedding
       MERGE (child)-[:IS_A]->(parent)
       RETURN parent, collect(child) AS children`,
      { ingredients },
    );

    const records = results.records;
    return records.map(
      (record) => record.get("parent").properties as CanonicalIngredient,
    );
  }

  async findAllCanonical(queryString = ""): Promise<CanonicalIngredient[]> {
    const result = await this.queryExecutor.run(
      `MATCH (i:CanonicalIngredient)
      WHERE toLower(i.name) CONTAINS toLower($queryString)
      RETURN i`,
      { queryString },
    );

    const records = result.records;
    return records.map(
      (record) => record.get("i").properties as CanonicalIngredient,
    );
  }

  async findAllUnmapped(): Promise<Ingredient[]> {
    const result = await this.queryExecutor.run(
      `MATCH (i:Ingredient)
       WHERE NOT (i)-[:MAPS_TO]->(:CanonicalIngredient)
       RETURN i`,
    );

    const records = result.records;
    return records.map((record) => record.get("i").properties as Ingredient);
  }

  async findSimilarCanonical(
    embedding: number[],
    limit = 5,
  ): Promise<{ match: CanonicalIngredient; confidence: number }[]> {
    const result = await this.queryExecutor.run(
      `CALL db.index.vector.queryNodes('canonical_embedding_index', $limit, $embedding)
      YIELD node AS c, score
      RETURN c, score
      ORDER BY score DESC`,
      { embedding, limit },
    );

    return result.records.map((record) => ({
      match: record.get("c").properties as CanonicalIngredient,
      confidence: record.get("score"),
    }));
  }

  async addCanonical(
    ingredientId: string,
    canonicalId: string,
    confidence: number,
  ): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (i:Ingredient {id: $ingredientId})
      MATCH (c:CanonicalIngredient {id: $canonicalId})
      MERGE (i)-[r:MAPS_TO]->(c)
      SET r.confidence = $confidence
      RETURN r, i, c`,
      { ingredientId, canonicalId, confidence },
    );

    if (!result.records[0]) {
      throw new InternalServerError(
        "Failed to add canonical ingredient to ingredient",
      );
    }
  }
}
