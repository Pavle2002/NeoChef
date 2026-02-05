import { DriverQueryExecutor, IngredientRepository } from "@neochef/core";
import { UnitOfWorkFactory } from "../../../core/src/utils/unit-of-work-factory.js";
import { neo4jClient } from "../config/neo4j.js";
import { R2_BUCKET, r2Client } from "../config/r2.js";
import { S3StorageService } from "./storage.js";

export const uowFactory = new UnitOfWorkFactory(neo4jClient);
export const queryExecutor = new DriverQueryExecutor(neo4jClient);
export const ingredientRepository = new IngredientRepository(queryExecutor);
export const storageService = new S3StorageService(r2Client, R2_BUCKET);
