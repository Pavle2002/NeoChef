import { QUEUES } from "@neochef/core";
import { logger } from "./config/logger.js";
import { queues } from "./services.js";
import { embeddingWorker } from "./workers/embedding-worker.js";
import { fetchWorker } from "./workers/fetch-worker.js";
import { transformWorker } from "./workers/transform-worker.js";
import { upsertWorker } from "./workers/upsert-worker.js";
import { randomUUID } from "crypto";

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

embeddingWorker.on("completed", (job) => {
  logger.info(`Embedding job with id: ${job.id} has been completed.`);
});

embeddingWorker.on("failed", (job, err) => {
  logger.error(`Embedding job ${job?.id} failed: ${err.message}`);
});

queues[QUEUES.EMBEDDING].upsertJobScheduler(
  "embedding-generation-scheduler",
  // { every: 240_000 },
  { pattern: "0 0 0,6,12,18 * * *" }, // every day at 00:00, 06:00, 12:00 and 18:00
  {
    name: "embedding-job-trigger",
    data: {
      type: "Embedding",
      correlationId: randomUUID(),
      purpose: "recommendations",
    },
  },
);
