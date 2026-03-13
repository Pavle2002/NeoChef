import {
  createNeo4jClient,
  CuisineRepository,
  DietRepository,
  DriverQueryExecutor,
  IngredientRepository,
  type ICuisineRepository,
  type IDietRepository,
  type IIngredientRepository,
} from "@neochef/core";
import { createClient } from "redis";
import { afterAll, beforeAll, beforeEach, inject } from "vitest";

process.env.NEO4J_URL = inject("NEO4J_URL");
process.env.NEO4J_USERNAME = inject("NEO4J_USERNAME");
process.env.NEO4J_PASSWORD = inject("NEO4J_PASSWORD");
process.env.REDIS_URL = inject("REDIS_URL");
process.env.REDIS_PORT = inject("REDIS_PORT");
process.env.EMBEDDER_URL = inject("EMBEDDER_URL");

declare global {
  var redis: ReturnType<typeof createClient>;
  var db: Awaited<ReturnType<typeof createNeo4jClient>>;
  var ingredientRepository: IIngredientRepository;
  var cuisineRepository: ICuisineRepository;
  var dietRepository: IDietRepository;
}

globalThis.redis = createClient({
  url: `redis://${inject("REDIS_URL")}:${inject("REDIS_PORT")}`,
});

globalThis.db = await createNeo4jClient(
  inject("NEO4J_URL"),
  inject("NEO4J_USERNAME"),
  inject("NEO4J_PASSWORD"),
);

const queryExecutor = new DriverQueryExecutor(globalThis.db);

globalThis.ingredientRepository = new IngredientRepository(queryExecutor);
globalThis.cuisineRepository = new CuisineRepository(queryExecutor);
globalThis.dietRepository = new DietRepository(queryExecutor);

beforeAll(async () => {
  await globalThis.redis.connect();
});

beforeEach(async () => {
  await globalThis.redis.flushDb();
  await globalThis.db.executeQuery("MATCH (n) DETACH DELETE n");
});

afterAll(async () => {
  await globalThis.redis.disconnect();
  await globalThis.db.close();
});
