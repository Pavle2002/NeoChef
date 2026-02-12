import {
  getTransformQueue,
  getUpsertQueue,
  DriverQueryExecutor,
  IngredientRepository,
  UnitOfWorkFactory,
} from "@neochef/core";
import { neo4jClient } from "../config/neo4j.js";
import { R2_BUCKET, r2Client } from "../config/r2.js";
import { S3StorageService } from "./storage.js";
import { EmbeddingService } from "./embedding-service.js";
import { config } from "../config/config.js";

export const connection = {
  host: config.redis.url,
  port: config.redis.port,
};

export const transformQueue = getTransformQueue(connection);
export const upsertQueue = getUpsertQueue(connection);

export const uowFactory = new UnitOfWorkFactory(neo4jClient);
export const queryExecutor = new DriverQueryExecutor(neo4jClient);

export const ingredientRepository = new IngredientRepository(queryExecutor);
export const storageService = new S3StorageService(r2Client, R2_BUCKET);
export const embeddingService = new EmbeddingService();
