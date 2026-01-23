import type { ExtendedRecipeData } from "@neochef/common";
import { logger } from "./config/logger.js";
import { fetchQueue } from "./config/queues.js";
import { fetchWorker } from "./workers/fetch-worker.js";
import { transformWorker } from "./workers/transform-worker.js";

logger.info("Starting recipe ingestion workers...");

fetchWorker.on("completed", (job) => {
  logger.info(`Fetch job with id: ${job.id} has been completed.`);
});

fetchWorker.on("failed", (job, err) => {
  logger.error(`Fetch job ${job?.id} failed: ${err.message}`);
});

transformWorker.on("completed", (job, result: ExtendedRecipeData[]) => {
  logger.info(`Transform job with id: ${job.id} has been completed.`);

  result.forEach((recipe) => {
    console.dir(recipe);
  });
});

transformWorker.on("failed", (job, err) => {
  logger.error(`Transform job ${job?.id} failed: ${err.message}`);
});

fetchQueue.add("test", { page: 0, pageSize: 1 });
