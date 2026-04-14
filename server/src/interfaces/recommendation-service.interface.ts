import type { Recipe, RecommendationMode } from "@neochef/common";

export interface IRecommendationService {
  getTopPicks(userId: string, mode: RecommendationMode): Promise<Recipe[]>;
  getSimilarToLastLiked(
    userId: string,
    mode: RecommendationMode,
  ): Promise<{ lastLiked: Recipe; recipes: Recipe[] } | null>;
  getFridgeBased(userId: string): Promise<Recipe[]>;
}
