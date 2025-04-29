import type { Result } from "neo4j-driver";

export interface IQueryExecutor {
  run(query: string, params?: Record<string, unknown>): Promise<Result>;
}
