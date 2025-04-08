import neo4j from "@config/neo4j.js";
import { Neo4jError } from "neo4j-driver";
import { type IUserRepository } from "@interfaces/index.js";
import { type User } from "@models/index.js";
import { type UserInput } from "@models/index.js";

export class UserRepository implements IUserRepository {
  private neo4jClient = neo4j;

  async findById(id: string): Promise<User | null> {
    const result = await this.neo4jClient.executeQuery(
      "MATCH (u:User {id: $id}) RETURN u",
      { id }
    );
    const record = result.records[0];
    return record ? (record.get("u").properties as User) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.neo4jClient.executeQuery(
      "MATCH (u:User {username: $username}) RETURN u",
      { username }
    );
    const record = result.records[0];
    return record ? (record.get("u").properties as User) : null;
  }

  async findAll(): Promise<User[]> {
    const result = await this.neo4jClient.executeQuery(
      "MATCH (u:User) RETURN u"
    );
    return result.records.map((record) => record.get("u").properties as User);
  }

  async create(user: UserInput): Promise<User> {
    try {
      const result = await this.neo4jClient.executeQuery(
        `CREATE (u:User {id: apoc.create.uuid(), username: $username, email: $email, password: $password})
        RETURN u`,
        user
      );

      const record = result.records[0];
      if (!record) {
        throw new Error("Failed to create user");
      }

      return record.get("u").properties as User;
    } catch (error) {
      if (
        error instanceof Neo4jError &&
        error.code === "Neo.ClientError.Schema.ConstraintValidationFailed"
      ) {
        throw new Error("User with the same email already exists");
      }
      throw error;
    }
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const result = await this.neo4jClient.executeQuery(
      `MATCH (u:User {id: $id})
      SET u += $updates
      RETURN u`,
      { id, updates: user }
    );

    const record = result.records[0];
    return record ? (record.get("u").properties as User) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.neo4jClient.executeQuery(
      `MATCH (u:User {id: $id}) 
      DELETE u 
      RETURN COUNT(u) AS count`,
      { id }
    );

    const record = result.records[0];
    return record ? record.get("count") > 0 : false;
  }
}
