import { Neo4jError } from "neo4j-driver";
import { type IUserRepository } from "@interfaces/user-repository.interface.js";
import { type User } from "@models/user.js";
import type { RegisterInput } from "@app-types/auth-types.js";
import { ConflictError, InternalServerError } from "@errors/index.js";
import { ErrorCodes } from "@utils/error-codes.js";
import type { IQueryExecutor } from "@interfaces/query-executor.interface.js";

export class UserRepository implements IUserRepository {
  constructor(private queryExecutor: IQueryExecutor) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.queryExecutor.run(
      "MATCH (u:User {id: $id}) RETURN u",
      { id }
    );
    const record = result.records[0];
    return record ? (record.get("u").properties as User) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.queryExecutor.run(
      "MATCH (u:User {username: $username}) RETURN u",
      { username }
    );
    const record = result.records[0];
    return record ? (record.get("u").properties as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.queryExecutor.run(
      "MATCH (u:User {email: $email}) RETURN u",
      { email }
    );
    const record = result.records[0];
    return record ? (record.get("u").properties as User) : null;
  }

  async findAll(): Promise<User[]> {
    const result = await this.queryExecutor.run("MATCH (u:User) RETURN u");
    return result.records.map((record) => record.get("u").properties as User);
  }

  async create(user: RegisterInput): Promise<User> {
    try {
      const result = await this.queryExecutor.run(
        `CREATE (u:User {id: apoc.create.uuid()})
        SET u += $user
        RETURN u`,
        { user }
      );

      const record = result.records[0];
      if (!record) {
        throw new InternalServerError("Failed to create user");
      }

      return record.get("u").properties as User;
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
    return record ? (record.get("u").properties as User) : null;
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
       MERGE (u)-[:LIKES_RECIPE]->(r)
       RETURN u, r`,
      { userId, recipeId }
    );

    if (!result.records[0]) {
      throw new InternalServerError("Failed to add liked recipe for user");
    }
  }

  async addHasIngredient(userId: string, ingredientId: string): Promise<void> {
    const result = await this.queryExecutor.run(
      `MATCH (u:User {id: $userId})
       MATCH (i:Ingredient {id: $ingredientId})
       MERGE (u)-[:HAS_INGREDIENT]->(i)
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
       MERGE (u)-[:DISLIKES_INGREDIENT]->(i)
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
}
