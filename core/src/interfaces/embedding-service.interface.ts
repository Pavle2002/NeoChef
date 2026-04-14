import type { ProjectionName } from "@neochef/common";

export interface IEmbeddingService {
  getEmbedding(input: string): Promise<number[]>;
  createRecommendationsProjection(): Promise<void>;
  runRecommendationsFastRP(): Promise<void>;
  createSimilarRecipesProjection(): Promise<void>;
  runSimilarRecipesFastRP(): Promise<void>;
  dropProjection(name: ProjectionName): Promise<void>;
}
