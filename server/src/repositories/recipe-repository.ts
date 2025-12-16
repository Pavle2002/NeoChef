import { type IRecipeRepository } from "@interfaces/recipe-repository.interface.js";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  type Cuisine,
  type Diet,
  type DishType,
  type Equipment,
  type ExtendedIngredient,
  type ExtendedRecipe,
  type IngredientUsage,
  type Recipe,
  type RecipeData,
  type RecipeFilters,
  type RecipeSortOptions,
} from "@neochef/common";
import { InternalServerError } from "@errors/index.js";
import type { IQueryExecutor } from "@interfaces/query-executor.interface.js";
import { neo4jDateTimeConverter } from "@utils/neo4j-datetime-converter.js";
import { int } from "neo4j-driver";

export class RecipeRepository implements IRecipeRepository {
  constructor(private readonly queryExecutor: IQueryExecutor) {}

  async findById(id: string): Promise<Recipe | null> {
    const result = await this.queryExecutor.run(
      `MATCH (r:Recipe {id: $id})
       OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
       RETURN r, COUNT(l) AS likeCount`,
      { id }
    );

    const record = result.records[0];
    if (!record) {
      return null;
    }

    const recipe = record.get("r").properties;
    recipe.createdAt = neo4jDateTimeConverter.toStandardDate(recipe.createdAt);
    recipe.likeCount = record.get("likeCount");
    return recipe as Recipe;
  }

  async findByIds(ids: string[]): Promise<Recipe[]> {
    if (ids.length === 0) {
      return [];
    }

    const result = await this.queryExecutor.run(
      `MATCH (r:Recipe)
       WHERE r.id IN $ids
       OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
       RETURN r, COUNT(l) AS likeCount`,
      { ids }
    );

    const recipeMap = new Map<string, Recipe>();
    result.records.forEach((record) => {
      const recipe = record.get("r").properties;
      recipe.createdAt = neo4jDateTimeConverter.toStandardDate(
        recipe.createdAt
      );
      recipe.likeCount = record.get("likeCount");
      recipeMap.set(recipe.id, recipe as Recipe);
    });

    return ids.map((id) => recipeMap.get(id)!);
  }

  async findByIdExtended(
    id: string,
    userId: string
  ): Promise<ExtendedRecipe | null> {
    const result = await this.queryExecutor.run(
      `MATCH (r:Recipe {id: $id})
      OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
      OPTIONAL MATCH (r)<-[ul:LIKES]-(:User {id: $userId})
      OPTIONAL MATCH (r)<-[us:SAVED]-(:User {id: $userId})
      OPTIONAL MATCH (r)-[:BELONGS_TO]->(c:Cuisine)
      OPTIONAL MATCH (r)-[:IS_OF_TYPE]->(t:DishType)
      OPTIONAL MATCH (r)-[u:CONTAINS]->(i:Ingredient)
      OPTIONAL MATCH (r)-[:REQUIRES]->(e:Equipment)
      OPTIONAL MATCH (r)-[:SUITABLE_FOR]->(d:Diet)
      WITH r,
        COUNT(DISTINCT ul) > 0 AS isLiked,
        COUNT(DISTINCT us) > 0 AS isSaved,
        COUNT(DISTINCT l) AS likeCount,
        collect(DISTINCT c) AS cuisines,
        collect(DISTINCT d) AS diets,
        collect(DISTINCT t) AS dishTypes,
        collect(DISTINCT e) AS equipment,
        collect(DISTINCT { ingredient: properties(i), usage: properties(u) }) AS ingredientUsages
      RETURN r, isLiked, isSaved, likeCount, cuisines, diets, dishTypes, equipment, ingredientUsages`,
      { id, userId }
    );

    const record = result.records[0];
    if (!record) {
      return null;
    }

    const recipe = record.get("r").properties;
    recipe.createdAt = neo4jDateTimeConverter.toStandardDate(recipe.createdAt);
    recipe.likeCount = record.get("likeCount");
    recipe.isLiked = record.get("isLiked");
    recipe.isSaved = record.get("isSaved");

    const extendedIngredients = record
      .get("ingredientUsages")
      .map((iu: any) => ({
        ingredient: iu.ingredient,
        usage: iu.usage,
      })) as ExtendedIngredient[];

    const extendedRecipe: ExtendedRecipe = {
      recipe,
      extendedIngredients,
      cuisines: record
        .get("cuisines")
        .map((c: any) => c.properties) as Cuisine[],
      diets: record.get("diets").map((d: any) => d.properties) as Diet[],
      dishTypes: record
        .get("dishTypes")
        .map((t: any) => t.properties) as DishType[],
      equipment: record
        .get("equipment")
        .map((e: any) => e.properties) as Equipment[],
    };

    return extendedRecipe;
  }

  async findAll(
    limit = DEFAULT_PAGE_SIZE,
    offset = 0,
    filters: RecipeFilters = {},
    sortOptions: RecipeSortOptions = {
      sortBy: DEFAULT_SORT_BY,
      sortOrder: DEFAULT_SORT_ORDER,
    }
  ): Promise<Recipe[]> {
    const { sortBy } = sortOptions;
    let orderByClause = "";
    const sortOrder = sortOptions.sortOrder === "asc" ? "ASC" : "DESC";

    if (sortBy === "likeCount") {
      orderByClause = `ORDER BY likeCount ${sortOrder}`;
    } else {
      orderByClause = `ORDER BY r.${sortBy} ${sortOrder}`;
    }

    const { matchClauses, whereClauses, params } =
      this.buildRecipeFilterQuery(filters);

    params.limit = int(limit);
    params.offset = int(offset);

    const whereString =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const cypher = `
    ${matchClauses.join("\n")}
    ${whereString}
    OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
    WITH r, COUNT(l) AS likeCount
    ${orderByClause}
    SKIP $offset LIMIT $limit
    RETURN r, likeCount
  `;

    const result = await this.queryExecutor.run(cypher, params);

    const recipes = result.records.map((record) => {
      const recipe = record.get("r").properties;
      recipe.createdAt = neo4jDateTimeConverter.toStandardDate(
        recipe.createdAt
      );
      recipe.likeCount = record.get("likeCount");
      return recipe as Recipe;
    });
    return recipes;
  }

  async findTrending(): Promise<{ recipe: Recipe; score: number }[]> {
    const result = await this.queryExecutor.run(
      `MATCH (r:Recipe)
       OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
       WITH r, 
            COUNT(l) AS totalLikes, 
            SUM(CASE WHEN l.likedAt >= datetime() - duration('P7D') THEN 1 ELSE 0 END) AS recentLikes

       OPTIONAL MATCH (r)<-[s:SAVED]-(:User)
       WHERE s.savedAt >= datetime() - duration('P7D')
       WITH r, totalLikes, recentLikes, COUNT(s) AS recentSaves

       WITH r, totalLikes, (recentLikes + (recentSaves * 2)) AS score
       ORDER BY score DESC
       LIMIT 24
       RETURN r, totalLikes, score`
    );

    const recipes = result.records.map((record) => {
      const recipe = record.get("r").properties;
      recipe.createdAt = neo4jDateTimeConverter.toStandardDate(
        recipe.createdAt
      );
      recipe.likeCount = record.get("totalLikes");
      const score = record.get("score");
      return { recipe, score } as { recipe: Recipe; score: number };
    });
    return recipes;
  }

  async createOrUpdate(recipe: RecipeData): Promise<Recipe> {
    const { sourceId, sourceName, ...upsertRecipe } = recipe;
    const result = await this.queryExecutor.run(
      `MERGE (r:Recipe {sourceName: $sourceName, sourceId: $sourceId})
      ON CREATE SET r.id = apoc.create.uuid(), r.createdAt = datetime(), r += $upsertRecipe
      ON MATCH SET r += $upsertRecipe
      WITH r
      OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
      RETURN r, COUNT(l) AS likeCount`,
      { sourceId, sourceName, upsertRecipe }
    );

    const record = result.records[0];
    if (!record) {
      throw new InternalServerError("Failed to create or update recipe");
    }

    const newRecipe = record.get("r").properties;
    newRecipe.createdAt = neo4jDateTimeConverter.toStandardDate(
      newRecipe.createdAt
    );
    newRecipe.likeCount = record.get("likeCount");

    return newRecipe as Recipe;
  }

  async addCuisine(recipeId: string, cuisine: Cuisine): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (r:Recipe {id: $recipeId})
      MERGE (c:Cuisine {name: $cuisine.name})
      MERGE (r)-[:BELONGS_TO]->(c)
      RETURN r`,
      { recipeId, cuisine }
    );
    if (!result.records[0]) {
      throw new InternalServerError("Failed to add cuisine to recipe");
    }
  }

  async addDiet(recipeId: string, diet: Diet): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (r:Recipe {id: $recipeId})
      MERGE (d:Diet {name: $diet.name})
      MERGE (r)-[:SUITABLE_FOR]->(d)
      RETURN r`,
      { recipeId, diet }
    );
    if (!result.records[0]) {
      throw new InternalServerError("Failed to add diet to recipe");
    }
  }

  async addDishType(recipeId: string, dishType: DishType): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (r:Recipe {id: $recipeId})
      MERGE (m:DishType {name: $dishType.name})
      MERGE (r)-[:IS_OF_TYPE]->(m)
      RETURN r`,
      { recipeId, dishType }
    );
    if (!result.records[0]) {
      throw new InternalServerError("Failed to add dish type to recipe");
    }
  }

  async addEquipment(recipeId: string, equipment: Equipment): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (r:Recipe {id: $recipeId})
      MERGE (e:Equipment {sourceName: $equipment.sourceName, sourceId: $equipment.sourceId})
      SET e += $equipment
      MERGE (r)-[:REQUIRES]->(e)
      RETURN r`,
      { recipeId, equipment }
    );
    if (!result.records[0]) {
      throw new InternalServerError("Failed to add equipment to recipe");
    }
  }

  async addIngredient(
    recipeId: string,
    ingredientId: string,
    usage: IngredientUsage
  ): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (r:Recipe {id: $recipeId})
       MATCH (i:Ingredient {id: $ingredientId})
       MERGE (r)-[rel:CONTAINS]->(i)
       SET rel += $usage
       RETURN r, i`,
      {
        recipeId,
        ingredientId,
        usage,
      }
    );
    if (!result.records[0]) {
      throw new InternalServerError("Failed to add ingredient to recipe");
    }
  }

  async countAll(filters: RecipeFilters = {}): Promise<number> {
    const { matchClauses, whereClauses, params } =
      this.buildRecipeFilterQuery(filters);

    const whereString =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const cypher = `
      ${matchClauses.join("\n")}
      ${whereString}
      OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
      RETURN COUNT(DISTINCT r) AS total
    `;
    const result = await this.queryExecutor.run(cypher, params);

    const totalNumber = result.records[0];
    return totalNumber ? totalNumber.get("total") : 0;
  }

  private buildRecipeFilterQuery(filters: RecipeFilters = {}) {
    const { cuisines, diets, dishTypes } = filters;
    let matchClauses = ["MATCH (r:Recipe)"];
    let whereClauses: string[] = [];
    let params: Record<string, any> = {};

    if (cuisines && cuisines.length > 0) {
      matchClauses.push("MATCH (r)-[:BELONGS_TO]->(c:Cuisine)");
      whereClauses.push("c.name IN $cuisines");
      params.cuisines = cuisines;
    }

    if (diets && diets.length > 0) {
      matchClauses.push("MATCH (r)-[:SUITABLE_FOR]->(d:Diet)");
      whereClauses.push("d.name IN $diets");
      params.diets = diets;
    }

    if (dishTypes && dishTypes.length > 0) {
      matchClauses.push("MATCH (r)-[:IS_OF_TYPE]->(dt:DishType)");
      whereClauses.push("dt.name IN $dishTypes");
      params.dishTypes = dishTypes;
    }

    return { matchClauses, whereClauses, params };
  }
}
