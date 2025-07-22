import type { IDietRepository } from "@interfaces/diet-repository.interface.js";
import type { IQueryExecutor } from "@interfaces/query-executor.interface.js";
import type { Diet } from "@models/diet.js";

export class DietRepository implements IDietRepository {
  constructor(private queryExecutor: IQueryExecutor) {}

  async findAll(): Promise<Diet[]> {
    const result = await this.queryExecutor.run(`MATCH (d:Diet) RETURN d`);

    const records = result.records;
    return records.map((record) => record.get("d").properties as Diet);
  }
}
