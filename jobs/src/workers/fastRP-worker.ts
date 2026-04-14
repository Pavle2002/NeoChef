import { Worker } from "bullmq";
import { embeddingService, connection } from "../services.js";
import type { FastRPJob } from "@neochef/common";
import { QUEUES } from "@neochef/core";

export const fastRPWorker = new Worker<FastRPJob>(
  QUEUES.FASTRP,
  async (job) => {
    await embeddingService.dropProjection("recommendations");
    await embeddingService.createRecommendationsProjection();
    await embeddingService.runRecommendationsFastRP();
    await embeddingService.dropProjection("recommendations");

    // await embeddingService.dropProjection("similarRecipes");
    // await embeddingService.createSimilarRecipesProjection();
    // await embeddingService.runSimilarRecipesFastRP();
    // await embeddingService.dropProjection("similarRecipes");
  },
  { connection },
);
