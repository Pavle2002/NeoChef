import type { DishType } from "@neochef/common";
import type { IDishTypeRepository } from "../interfaces/dish-type-repository.interface.js";
import type { IQueryExecutor } from "../interfaces/query-executor.interface.js";

export class DishTypeRepository implements IDishTypeRepository {
  constructor(private readonly queryExecutor: IQueryExecutor) {}

  async findAll(): Promise<DishType[]> {
    const result = await this.queryExecutor.run(`MATCH (d:DishType) RETURN d`);

    const records = result.records;
    return records.map((record) => record.get("d").properties as DishType);
  }
}
