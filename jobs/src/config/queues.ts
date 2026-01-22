import { Queue } from "bullmq";
import type { FetchJob, NormalizeJob, UpsertJob } from "../types/job-types.js";
import { config } from "./config.js";

export const QUEUES = {
  FETCH: "fetch-queue",
  NORMALIZE: "normalize-queue",
  UPSERT: "upsert-queue",
} as const;

export const connection = { host: config.redis.url, port: config.redis.port };

export const fetchQueue = new Queue<FetchJob>(QUEUES.FETCH, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const normalizeQueue = new Queue<NormalizeJob>(QUEUES.NORMALIZE, {
  connection,
});

export const upsertQueue = new Queue<UpsertJob>(QUEUES.UPSERT, { connection });
