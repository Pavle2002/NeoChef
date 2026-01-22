import { logger } from "./config/logger.js";
import { fetchQueue } from "./config/queues.js";
import { fetchWorker } from "./workers/fetch-worker.js";

logger.info("Starting recipe ingestion workers...");

fetchWorker.on("completed", (job, result: any) => {
  logger.info(`Fetch job with id: ${job.id} has been completed.`);
  console.dir(result, { depth: null });
});

fetchWorker.on("failed", (job, err) => {
  logger.error(`Fetch-store job ${job?.id} failed: ${err.message}`);
});

fetchQueue.add("test", { page: 0, pageSize: 1 });
