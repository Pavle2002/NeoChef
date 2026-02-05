import type { ExtendedRecipeData } from "@neochef/common";
import { ensureConstraints } from "@neochef/core";
import { logger } from "./config/logger.js";
import { fetchQueue, transformQueue } from "./config/queues.js";
import { ingredientRepository, queryExecutor } from "./services/index.js";

logger.info("Ensuring database constraints...");

await ensureConstraints(queryExecutor);

logger.info("Starting recipe ingestion workers...");

// Import workers AFTER constraints are created
const { fetchWorker } = await import("./workers/fetch-worker.js");
const { transformWorker } = await import("./workers/transform-worker.js");
const { upsertWorker } = await import("./workers/upsert-worker.js");

fetchWorker.on("completed", (job) => {
  logger.info(`Fetch job with id: ${job.id} has been completed.`);
});

fetchWorker.on("failed", (job, err) => {
  logger.error(`Fetch job ${job?.id} failed: ${err.message}`);
});

transformWorker.on("completed", (job, result: ExtendedRecipeData[]) => {
  logger.info(`Transform job with id: ${job.id} has been completed.`);

  result.forEach((recipe) => {
    logger.info(`Transformed recipe with id: ${recipe.recipeData.sourceId}`);
  });
});

transformWorker.on("failed", (job, err) => {
  logger.error(`Transform job ${job?.id} failed: ${err.message}`);
});

upsertWorker.on("completed", (job, result: string) => {
  logger.info(`Upsert job with id: ${job.id} has been completed.`);

  logger.info(`Upserted recipe with id: ${result}`);
});

upsertWorker.on("failed", (job, err) => {
  logger.error(`Upsert job ${job?.id} failed: ${err.message}`);
});

transformQueue.add("test", { page: 0 });
