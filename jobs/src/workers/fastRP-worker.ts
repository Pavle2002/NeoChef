import { Worker } from "bullmq";
import { embeddingService, connection } from "../services.js";
import type { FastRPJob } from "@neochef/common";
import { QUEUES } from "@neochef/core";

export const fastRPWorker = new Worker<FastRPJob>(
  QUEUES.FASTRP,
  async (job) => {
    await embeddingService.createProjection();
    await embeddingService.runFastRP();
  },
  { connection },
);
