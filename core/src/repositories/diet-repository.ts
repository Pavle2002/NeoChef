import { InternalServerError } from "../errors/internal-server-error.js";
import type { IDietRepository } from "../interfaces/diet-repository.interface.js";
import type { IQueryExecutor } from "../interfaces/query-executor.interface.js";
import type { Diet } from "@neochef/common";

export class DietRepository implements IDietRepository {
  constructor(private readonly queryExecutor: IQueryExecutor) {}

  async findAll(): Promise<Diet[]> {
    const result = await this.queryExecutor.run(`MATCH (d:Diet) RETURN d`);

    const records = result.records;
    return records.map((record) => record.get("d").properties as Diet);
  }

  async create(diet: Diet): Promise<Diet> {
    const result = await this.queryExecutor.run(
      `MERGE (d:Diet {name: $diet.name}) RETURN d`,
      { diet },
    );

    const record = result.records[0];
    if (!record) {
      throw new InternalServerError("Failed to create diet");
    }

    return record.get("d").properties as Diet;
  }
}
