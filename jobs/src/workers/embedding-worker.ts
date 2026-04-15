import { Worker } from "bullmq";
import { embeddingService, connection } from "../services.js";
import type { EmbeddingJob } from "@neochef/common";
import { QUEUES } from "@neochef/core";

export const embeddingWorker = new Worker<EmbeddingJob>(
  QUEUES.EMBEDDING,
  async (job) => {
    const purpose = job.data.purpose;

    if (purpose === "recommendations") {
      await embeddingService.generateRecommendationEmbeddings();
    } else if (purpose === "recipe-similarity") {
      await embeddingService.generateRecipeSimilarityEmbeddings();
    }
  },
  { connection },
);
