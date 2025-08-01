import type { IQueryExecutor } from "@interfaces/query-executor.interface.js";
import type { DishType } from "@common/schemas/dish-type.js";
import type { IDishTypeRepository } from "@interfaces/dish-type-repositoy.interface.js";

export class DishTypeRepository implements IDishTypeRepository {
  constructor(private queryExecutor: IQueryExecutor) {}

  async findAll(): Promise<DishType[]> {
    const result = await this.queryExecutor.run(`MATCH (d:DishType) RETURN d`);

    const records = result.records;
    return records.map((record) => record.get("d").properties as DishType);
  }
}
