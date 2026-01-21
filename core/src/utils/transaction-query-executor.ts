import type { ManagedTransaction, Result } from "neo4j-driver";
import type { IQueryExecutor } from "../interfaces/query-executor.interface.js";

export class TransactionQueryExecutor implements IQueryExecutor {
  constructor(private transaction: ManagedTransaction) {}

  async run(query: string, params?: Record<string, unknown>): Promise<Result> {
    return this.transaction.run(query, params);
  }
}
