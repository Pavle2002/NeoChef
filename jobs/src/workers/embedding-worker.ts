import { Worker } from "bullmq";
import { embeddingService, connection } from "../services.js";
import type { EmbeddingJob } from "@neochef/common";
import { QUEUES } from "@neochef/core";
import { redisClient } from "../config/redis.js";

export const embeddingWorker = new Worker<EmbeddingJob>(
  QUEUES.EMBEDDING,
  async (job) => {
    const purpose = job.data.purpose;

    if (purpose === "recommendations") {
      await embeddingService.generateRecommendationEmbeddings();
      let cursor = 0;

      do {
        const { cursor: nextCursor, keys } = await redisClient.scan(cursor, {
          MATCH: "rec:top-picks:*",
          COUNT: 500,
        });

        cursor = nextCursor;

        if (keys.length > 0) {
          await redisClient.unlink(keys);
        }
      } while (cursor !== 0);
    } else if (purpose === "recipe-similarity") {
      await embeddingService.generateRecipeSimilarityEmbeddings();
    }
  },
  { connection },
);
