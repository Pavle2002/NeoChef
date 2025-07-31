import { type IRecipeRepository } from "@interfaces/recipe-repository.interface.js";
import { type Recipe, type RecipeData } from "@common/schemas/recipe.js";
import { type Cuisine } from "@common/schemas/cuisine.js";
import { type Diet } from "@common/schemas/diet.js";
import { type DishType } from "@common/schemas/dish-type.js";
import { type Equipment } from "@common/schemas/equipment.js";
import { InternalServerError } from "@errors/index.js";
import type { IQueryExecutor } from "@interfaces/query-executor.interface.js";
import { neo4jDateTimeConverter } from "@utils/neo4j-datetime-converter.js";
import { int } from "neo4j-driver";
import type { IngredientUsage } from "@common/schemas/ingredient.js";

export class RecipeRepository implements IRecipeRepository {
  constructor(private queryExecutor: IQueryExecutor) {}

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

  async findAll(limit = 20, offset = 0): Promise<Recipe[]> {
    const parsedLimit = int(limit);
    const parsedOffset = int(offset);
    const result = await this.queryExecutor.run(
      `MATCH (r:Recipe)
       OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
       WITH r, COUNT(l) AS likeCount
       SKIP $offset LIMIT $limit
       RETURN r, likeCount`,
      { limit: parsedLimit, offset: parsedOffset }
    );
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

  async findTrending(): Promise<Recipe[]> {
    const result = await this.queryExecutor.run(
      `MATCH (r:Recipe)
       OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
       WHERE l.likedAt >= datetime() - duration('P7D') OR l IS NULL
       WITH r, COUNT(l) AS likeCount
       ORDER BY likeCount DESC
       LIMIT 100
       RETURN r, likeCount`
    );
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

  async countAll(): Promise<number> {
    const result = await this.queryExecutor.run(
      "MATCH (r:Recipe) RETURN count(r) AS total"
    );
    const totalNumber = result.records[0];
    return totalNumber ? totalNumber.get("total") : 0;
  }
}
