import { type IRecipeRepository } from "@interfaces/recipe-repository.interface.js";
import { type Recipe } from "@models/recipe.js";
import { type RecipeData } from "@app-types/recipe-types.js";
import { type Cuisine } from "@models/cuisine.js";
import { type Diet } from "@models/diet.js";
import { type DishType } from "@models/dish-type.js";
import { type Equipment } from "@models/equipment.js";
import { InternalServerError } from "@errors/index.js";
import type { IQueryExecutor } from "@interfaces/query-executor.interface.js";
import type { IngredientUsage } from "@app-types/ingredient-types.js";
import { neo4jDateTimeConverter } from "@utils/neo4j-datetime-converter.js";
import { int } from "neo4j-driver";

export class RecipeRepository implements IRecipeRepository {
  constructor(private queryExecutor: IQueryExecutor) {}

  async findById(id: string): Promise<Recipe | null> {
    const result = await this.queryExecutor.run(
      "MATCH (r:Recipe {id: $id}) RETURN r",
      { id }
    );
    const record = result.records[0];
    if (!record) {
      return null;
    }
    const recipe = record.get("r").properties;
    recipe.createdAt = neo4jDateTimeConverter.toStandardDate(recipe.createdAt);
    return recipe as Recipe;
  }

  async findAll(limit = 20, offset = 0): Promise<Recipe[]> {
    const parsedLimit = int(limit);
    const parsedOffset = int(offset);
    const result = await this.queryExecutor.run(
      "MATCH (r:Recipe) RETURN r SKIP $offset LIMIT $limit",
      { limit: parsedLimit, offset: parsedOffset }
    );
    const recipes = result.records.map((record) => {
      const recipe = record.get("r").properties;
      recipe.createdAt = neo4jDateTimeConverter.toStandardDate(
        recipe.createdAt
      );
      return recipe as Recipe;
    });
    return recipes;
  }

  async findTrending(): Promise<Recipe[]> {
    const result = await this.queryExecutor.run(
      `MATCH (r:Recipe)<-[l:LIKES]-(:User)
       WHERE l.likedAt >= datetime() - duration('P7D')
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
      RETURN r`,
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
