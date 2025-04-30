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

export class RecipeRepository implements IRecipeRepository {
  constructor(private queryExecutor: IQueryExecutor) {}

  async findById(id: string): Promise<Recipe | null> {
    const result = await this.queryExecutor.run(
      "MATCH (r:Recipe {id: $id}) RETURN r",
      { id }
    );
    const record = result.records[0];
    return record ? (record.get("r").properties as Recipe) : null;
  }

  async createOrUpdate(recipe: RecipeData): Promise<Recipe> {
    const { sourceId, sourceName, ...upsertRecipe } = recipe;
    const result = await this.queryExecutor.run(
      `MERGE (r:Recipe {sourceName: $sourceName, sourceId: $sourceId})
      ON CREATE SET r.id = apoc.create.uuid(), r += $upsertRecipe
      ON MATCH SET r += $upsertRecipe
      RETURN r`,
      { sourceId, sourceName, upsertRecipe }
    );
    const record = result.records[0];
    if (!record) {
      throw new InternalServerError("Failed to create or update recipe");
    }
    return record.get("r").properties as Recipe;
  }

  async addCuisine(recipeId: string, cuisine: Cuisine): Promise<void> {
    await this.queryExecutor.run(
      `MATCH (r:Recipe {id: $recipeId})
      MERGE (c:Cuisine {name: $cuisine.name})
      MERGE (r)-[:BELONGS_TO]->(c)`,
      { recipeId, cuisine }
    );
  }

  async addDiet(recipeId: string, diet: Diet): Promise<void> {
    await this.queryExecutor.run(
      `MATCH (r:Recipe {id: $recipeId})
      MERGE (d:Diet {name: $diet.name})
      MERGE (r)-[:SUITABLE_FOR]->(d)`,
      { recipeId, diet }
    );
  }

  async addDishType(recipeId: string, dishType: DishType): Promise<void> {
    await this.queryExecutor.run(
      `MATCH (r:Recipe {id: $recipeId})
      MERGE (m:DishType {name: $dishType.name})
      MERGE (r)-[:IS_OF_TYPE]->(m)`,
      { recipeId, dishType }
    );
  }

  async addEquipment(recipeId: string, equipment: Equipment): Promise<void> {
    await this.queryExecutor.run(
      `MATCH (r:Recipe {id: $recipeId})
      MERGE (e:Equipment {sourceName: $equipment.sourceName, sourceId: $equipment.sourceId})
      SET e.name = $equipment.name, e.image = $equipment.image
      MERGE (r)-[:REQUIRES]->(e)`,
      { recipeId, equipment }
    );
  }

  async addIngredient(
    recipeId: string,
    ingredientId: string,
    usage: IngredientUsage
  ): Promise<void> {
    await this.queryExecutor.run(
      `MATCH (r:Recipe {id: $recipeId})
       MATCH (i:Ingredient {id: $ingredientId})
       MERGE (r)-[rel:CONTAINS]->(i)
       SET rel += $usage`,
      {
        recipeId,
        ingredientId,
        usage,
      }
    );
  }
}
