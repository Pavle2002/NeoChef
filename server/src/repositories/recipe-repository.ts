import { type IRecipeRepository } from "@interfaces/recipe-repository.interface.js";
import { type Recipe } from "@models/recipe.js";
import { type RecipeData } from "@app-types/recipe-types.js";
import { type Cuisine } from "@models/cuisine.js";
import { type Diet } from "@models/diet.js";
import { type DishType } from "@models/dish-type.js";
import { type Equipment } from "@models/equipment.js";
import neo4jClient from "@config/neo4j.js";
import { InternalServerError } from "@errors/index.js";
import { type IIngredientRepository } from "@interfaces/ingredient-repository.interface.js";
import { type ExtendedIngredient } from "@app-types/ingredient-types.js";

export class RecipeRepository implements IRecipeRepository {
  constructor(private ingredientRepository: IIngredientRepository) {}
  private neo4j = neo4jClient;

  async createOrUpdate(recipe: RecipeData): Promise<Recipe> {
    const { spoonacularId, ...upsertRecipe } = recipe;
    const result = await this.neo4j.executeQuery(
      `MERGE (r:Recipe {spoonacularId: $spoonacularId})
      ON CREATE SET r.id = apoc.create.uuid(), r += $upsertRecipe
      ON MATCH SET r += $upsertRecipe
      RETURN r`,
      { spoonacularId: recipe.spoonacularId, upsertRecipe }
    );
    const record = result.records[0];
    if (!record) {
      throw new InternalServerError("Failed to create or update recipe");
    }
    return record.get("r").properties as Recipe;
  }

  async linkToCuisine(recipeId: string, cuisine: Cuisine): Promise<void> {
    await this.neo4j.executeQuery(
      `MATCH (r:Recipe {id: $recipeId})
      MERGE (c:Cuisine {name: $cuisine.name})
      MERGE (r)-[:BELONGS_TO]->(c)`,
      { recipeId, cuisine }
    );
  }

  async linkToDiet(recipeId: string, diet: Diet): Promise<void> {
    await this.neo4j.executeQuery(
      `MATCH (r:Recipe {id: $recipeId})
      MERGE (d:Diet {name: $diet.name})
      MERGE (r)-[:SUITABLE_FOR]->(d)`,
      { recipeId, diet }
    );
  }

  async linkToDishType(recipeId: string, dishType: DishType): Promise<void> {
    await this.neo4j.executeQuery(
      `MATCH (r:Recipe {id: $recipeId})
      MERGE (m:DishType {name: $dishType.name})
      MERGE (r)-[:IS_OF_TYPE]->(m)`,
      { recipeId, dishType }
    );
  }

  async linkToEquipment(recipeId: string, equipment: Equipment): Promise<void> {
    await this.neo4j.executeQuery(
      `MATCH (r:Recipe {id: $recipeId})
      MERGE (e:Equipment {spoonacularId: $equipment.spoonacularId})
      SET e.name = $equipment.name, e.image = $equipment.image
      MERGE (r)-[:REQUIRES]->(e)`,
      { recipeId, equipment }
    );
  }

  async linkToIngredient(
    recipeId: string,
    ingredient: ExtendedIngredient
  ): Promise<void> {
    const savedIngredient = await this.ingredientRepository.createOrUpdate(
      ingredient.ingredientData
    );
    await this.neo4j.executeQuery(
      `MATCH (r:Recipe {id: $recipeId})
       MATCH (i:Ingredient {id: $ingredientId})
       MERGE (r)-[rel:CONTAINS]->(i)
       SET rel.amount = $amount,
           rel.unit = $unit`,
      {
        recipeId,
        ingredientId: savedIngredient.id,
        amount: ingredient.amount,
        unit: ingredient.unit,
      }
    );
  }
}
