import {
  DriverQueryExecutor,
  IngredientRepository,
  UnitOfWorkFactory,
  EmbeddingService,
  S3StorageService,
  getQueues,
  GDSService,
} from "@neochef/core";
import { config } from "./config/config.js";
import { neo4jClient } from "./config/neo4j.js";
import { r2Client } from "./config/r2.js";

export const connection = {
  host: config.redis.url,
  port: config.redis.port,
};

export const queues = getQueues(connection);

export const uowFactory = new UnitOfWorkFactory(neo4jClient);
export const queryExecutor = new DriverQueryExecutor(neo4jClient);

export const ingredientRepository = new IngredientRepository(queryExecutor);
export const storageService = new S3StorageService(
  r2Client,
  config.r2.bucketName,
);
const gdsService = new GDSService(queryExecutor);
export const embeddingService = new EmbeddingService(
  config.embedderUrl,
  gdsService,
);
