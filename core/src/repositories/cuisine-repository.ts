import { InternalServerError } from "../errors/internal-server-error.js";
import type { ICuisineRepository } from "../interfaces/cuisine-repository.interface.js";
import type { IQueryExecutor } from "../interfaces/query-executor.interface.js";
import type { Cuisine } from "@neochef/common";

export class CuisineRepository implements ICuisineRepository {
  constructor(private readonly queryExecutor: IQueryExecutor) {}

  async findAll(): Promise<Cuisine[]> {
    const result = await this.queryExecutor.run(`MATCH (c:Cuisine) RETURN c`);

    const records = result.records;
    return records.map((record) => record.get("c").properties as Cuisine);
  }

  async create(cuisine: Cuisine): Promise<Cuisine> {
    const result = await this.queryExecutor.run(
      `MERGE (c:Cuisine {name: $cuisine.name}) RETURN c`,
      { cuisine },
    );

    const record = result.records[0];
    if (!record) {
      throw new InternalServerError("Failed to create cuisine");
    }

    return record.get("c").properties as Cuisine;
  }
}
