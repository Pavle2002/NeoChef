import { logger } from "./config/logger.js";
import { transformQueue } from "./services/index.js";
import { fetchWorker } from "./workers/fetch-worker.js";
import { transformWorker } from "./workers/transform-worker.js";
import { upsertWorker } from "./workers/upsert-worker.js";

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

upsertWorker.on("completed", (job, result: string) => {
  logger.info(`Upsert job with id: ${job.id} has been completed.`);

  logger.info(`Upserted recipe with id: ${result}`);
});

upsertWorker.on("failed", (job, err) => {
  logger.error(`Upsert job ${job?.id} failed: ${err.message}`);
});

// transformQueue.add("test", { page: 0, corelationId: "test-corelation-id" });
// transformQueue.add("test", { page: 1, corelationId: "test-corelation-id" });
// transformQueue.add("test", { page: 2, corelationId: "test-corelation-id" });
// transformQueue.add("test", { page: 3, corelationId: "test-corelation-id" });
// transformQueue.add("test", { page: 4, corelationId: "test-corelation-id" });
// transformQueue.add("test", { page: 5, corelationId: "test-corelation-id" });
// transformQueue.add("test", { page: 6, corelationId: "test-corelation-id" });
// transformQueue.add("test", { page: 7, corelationId: "test-corelation-id" });
// transformQueue.add("test", { page: 8, corelationId: "test-corelation-id" });
// transformQueue.add("test", { page: 9, corelationId: "test-corelation-id" });
