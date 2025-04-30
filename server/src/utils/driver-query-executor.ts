import type { IQueryExecutor } from "@interfaces/query-executor.interface.js";
import type { Driver, EagerResult, Result } from "neo4j-driver";

export class DriverQueryExecutor implements IQueryExecutor {
  constructor(private driver: Driver) {}

  async run(query: string, params?: Record<string, unknown>): Promise<Result> {
    return this.driver.executeQuery(query, params);
  }
}
