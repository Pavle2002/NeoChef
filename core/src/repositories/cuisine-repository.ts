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
}
