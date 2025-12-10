import { Neo4jError } from "neo4j-driver";
import { type IUserRepository } from "@interfaces/user-repository.interface.js";
import { type User } from "@common/schemas/user.js";
import type { UserData } from "@common/schemas/user.js";
import { ConflictError, InternalServerError } from "@errors/index.js";
import { ErrorCodes } from "@common/utils/error-codes.js";
import type { IQueryExecutor } from "@interfaces/query-executor.interface.js";
import { neo4jDateTimeConverter } from "@utils/neo4j-datetime-converter.js";
import type { Diet } from "@common/schemas/diet.js";
import type { Cuisine } from "@common/schemas/cuisine.js";
import type { Ingredient } from "@common/schemas/ingredient.js";
import type { Recipe } from "@common/schemas/recipe.js";

export class UserRepository implements IUserRepository {
  constructor(private readonly queryExecutor: IQueryExecutor) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.queryExecutor.run(
      "MATCH (u:User {id: $id}) RETURN u",
      { id }
    );
    const record = result.records[0];
    if (!record) {
      return null;
    }
    const user = record.get("u").properties;
    user.createdAt = neo4jDateTimeConverter.toStandardDate(user.createdAt);
    return user as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.queryExecutor.run(
      "MATCH (u:User {email: $email}) RETURN u",
      { email }
    );
    const record = result.records[0];
    if (!record) {
      return null;
    }
    const user = record.get("u").properties;
    user.createdAt = neo4jDateTimeConverter.toStandardDate(user.createdAt);
    return user as User;
  }

  async findAll(): Promise<User[]> {
    const result = await this.queryExecutor.run("MATCH (u:User) RETURN u");
    const users = result.records.map((record) => {
      const user = record.get("u").properties;
      user.createdAt = neo4jDateTimeConverter.toStandardDate(user.createdAt);
      return user as User;
    });
    return users;
  }

  async create(user: UserData): Promise<User> {
    try {
      const result = await this.queryExecutor.run(
        `CREATE (u:User {id: apoc.create.uuid(), createdAt: datetime()})
        SET u += $user
        RETURN u`,
        { user }
      );

      const record = result.records[0];
      if (!record) {
        throw new InternalServerError("Failed to create user");
      }

      const newUser = record.get("u").properties;
      newUser.createdAt = neo4jDateTimeConverter.toStandardDate(
        newUser.createdAt
      );
      return newUser as User;
    } catch (error) {
      if (
        error instanceof Neo4jError &&
        error.code === "Neo.ClientError.Schema.ConstraintValidationFailed"
      ) {
        if (error.message.includes("email")) {
          throw new ConflictError(
            "User with the same email already exists",
            ErrorCodes.RES_CONFLICT_EMAIL
          );
        }
        if (error.message.includes("username"))
          throw new ConflictError(
            "User with the same username already exists",
            ErrorCodes.RES_CONFLICT_USERNAME
          );
      }
      throw error;
    }
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $id})
      SET u += $updates
      RETURN u`,
      { id, updates: user }
    );

    const record = result.records[0];
    if (!record) {
      return null;
    }
    const updatedUser = record.get("u").properties;
    updatedUser.createdAt = neo4jDateTimeConverter.toStandardDate(
      updatedUser.createdAt
    );
    return updatedUser as User;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $id})
      DELETE u
      RETURN COUNT(u) AS count`,
      { id }
    );

    const record = result.records[0];
    return record ? record.get("count") > 0 : false;
  }

  async addLikesRecipe(userId: string, recipeId: string): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})
       MATCH (r:Recipe {id: $recipeId})
       MERGE (u)-[rel:LIKES]->(r)
       ON CREATE SET rel.likedAt = datetime()
       RETURN u, r, rel`,
      { userId, recipeId }
    );

    if (!result.records[0]) {
      throw new InternalServerError("Failed to add liked recipe for user");
    }
  }

  async addSavedRecipe(userId: string, recipeId: string): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})
       MATCH (r:Recipe {id: $recipeId})
       MERGE (u)-[rel:SAVED]->(r)
       ON CREATE SET rel.savedAt = datetime()
       RETURN u, r, rel`,
      { userId, recipeId }
    );

    if (!result.records[0]) {
      throw new InternalServerError("Failed to add saved recipe for user");
    }
  }

  async addHasIngredient(userId: string, ingredientId: string): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})
       MATCH (i:Ingredient {id: $ingredientId})
       MERGE (u)-[:HAS]->(i)
       RETURN u, i`,
      { userId, ingredientId }
    );

    if (!result.records[0]) {
      throw new InternalServerError(
        "Failed to add ingredient to user's pantry"
      );
    }
  }

  async addDislikesIngredient(
    userId: string,
    ingredientId: string
  ): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})
       MATCH (i:Ingredient {id: $ingredientId})
       MERGE (u)-[:DISLIKES]->(i)
       RETURN u, i`,
      { userId, ingredientId }
    );

    if (!result.records[0]) {
      throw new InternalServerError(
        "Failed to add disliked ingredient for user"
      );
    }
  }

  async addPrefersCuisine(userId: string, cuisineName: string): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})
       MATCH (c:Cuisine {name: $cuisineName})
       MERGE (u)-[:PREFERS]->(c)
       RETURN u, c`,
      { userId, cuisineName }
    );

    if (!result.records[0]) {
      throw new InternalServerError("Failed to add preferred cuisine for user");
    }
  }

  async addFollowsDiet(userId: string, dietName: string): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})
       MATCH (d:Diet {name: $dietName})
       MERGE (u)-[:FOLLOWS]->(d)
       RETURN u, d`,
      { userId, dietName }
    );

    if (!result.records[0]) {
      throw new InternalServerError("Failed to add followed diet for user");
    }
  }

  async removeLikesRecipe(userId: string, recipeId: string): Promise<boolean> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})-[rel:LIKES]->(r:Recipe {id: $recipeId})
       DELETE rel
       RETURN COUNT(rel) AS count`,
      { userId, recipeId }
    );

    const record = result.records[0];
    return record ? record.get("count") > 0 : false;
  }

  async removeSavedRecipe(userId: string, recipeId: string): Promise<boolean> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})-[rel:SAVED]->(r:Recipe {id: $recipeId})
       DELETE rel
       RETURN COUNT(rel) AS count`,
      { userId, recipeId }
    );

    const record = result.records[0];
    return record ? record.get("count") > 0 : false;
  }

  async removeDislikesIngredient(
    userId: string,
    ingredientId: string
  ): Promise<boolean> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})-[rel:DISLIKES]->(i:Ingredient {id: $ingredientId})
       DELETE rel
       RETURN COUNT(rel) AS count`,
      { userId, ingredientId }
    );

    const record = result.records[0];
    return record ? record.get("count") > 0 : false;
  }

  async removePrefersCuisine(
    userId: string,
    cuisineName: string
  ): Promise<boolean> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})-[rel:PREFERS]->(c:Cuisine {name: $cuisineName})
       DELETE rel
       RETURN COUNT(rel) AS count`,
      { userId, cuisineName }
    );

    const record = result.records[0];
    return record ? record.get("count") > 0 : false;
  }

  async removeFollowsDiet(userId: string, dietName: string): Promise<boolean> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})-[rel:FOLLOWS]->(d:Diet {name: $dietName})
       DELETE rel
       RETURN COUNT(rel) AS count`,
      { userId, dietName }
    );

    const record = result.records[0];
    return record ? record.get("count") > 0 : false;
  }

  async removeHasIngredient(
    userId: string,
    ingredientId: string
  ): Promise<boolean> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})-[rel:HAS]->(i:Ingredient {id: $ingredientId})
       DELETE rel
       RETURN COUNT(rel) AS count`,
      { userId, ingredientId }
    );

    const record = result.records[0];
    return record ? record.get("count") > 0 : false;
  }

  async getFollowedDiets(userId: string): Promise<Diet[]> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})-[:FOLLOWS]->(d:Diet)
       RETURN d`,
      { userId }
    );

    return result.records.map((record) => record.get("d").properties as Diet);
  }

  async getPreferredCuisines(userId: string): Promise<Cuisine[]> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})-[:PREFERS]->(c:Cuisine)
       RETURN c`,
      { userId }
    );

    return result.records.map(
      (record) => record.get("c").properties as Cuisine
    );
  }

  async getDislikedIngredients(userId: string): Promise<Ingredient[]> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})-[:DISLIKES]->(i:Ingredient)
       RETURN i`,
      { userId }
    );

    return result.records.map(
      (record) => record.get("i").properties as Ingredient
    );
  }

  async getHasIngredients(userId: string): Promise<Ingredient[]> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})-[:HAS]->(i:Ingredient)
       RETURN i`,
      { userId }
    );

    return result.records.map(
      (record) => record.get("i").properties as Ingredient
    );
  }

  async getSavedRecipes(userId: string): Promise<Recipe[]> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})-[s:SAVED]->(r:Recipe)
       OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
       ORDER BY s.savedAt DESC
       RETURN r, COUNT(l) AS likeCount`,
      { userId }
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
}
