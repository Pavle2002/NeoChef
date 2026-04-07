import { getFastRPQueue } from "@neochef/core";
import { logger } from "./config/logger.js";
import { fastRPWorker } from "./workers/fastRP-worker.js";
import { fetchWorker } from "./workers/fetch-worker.js";
import { transformWorker } from "./workers/transform-worker.js";
import { upsertWorker } from "./workers/upsert-worker.js";
import { connection } from "./services.js";

logger.info("Starting recipe ingestion workers...");

fetchWorker.on("completed", (job) => {
  logger.info(`Fetch job with id: ${job.id} has been completed.`);
});

fetchWorker.on("failed", (job, err) => {
  logger.error(`Fetch job ${job?.id} failed: ${err.message}`);
});

transformWorker.on("completed", (job) => {
  logger.info(`Transform job with id: ${job.id} has been completed.`);
});

transformWorker.on("failed", (job, err) => {
  logger.error(`Transform job ${job?.id} failed: ${err.message}`);
});

upsertWorker.on("completed", (job, result) => {
  logger.info(`Upsert job with id: ${job.id} has been completed.`);

  logger.info(`Upserted recipe with id: ${result}`);
});

upsertWorker.on("failed", (job, err) => {
  logger.error(`Upsert job ${job?.id} failed: ${err.message}`);
});

fastRPWorker.on("completed", (job) => {
  logger.info(`FastRP job with id: ${job.id} has been completed.`);
});

fastRPWorker.on("failed", (job, err) => {
  logger.error(`FastRP job ${job?.id} failed: ${err.message}`);
});

const fastRPQueue = getFastRPQueue(connection);

fastRPQueue.add("fastrp-job", {
  type: "FastRP",
});
