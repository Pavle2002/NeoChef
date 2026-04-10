import type { Recipe, RecommendationMode } from "@neochef/common";

export interface IRecommendationService {
  getTopPicks(userId: string, mode: RecommendationMode): Promise<Recipe[]>;
  getFridgeBased(userId: string): Promise<Recipe[]>;
  getSimilarToLastLiked(
    userId: string,
  ): Promise<{ basedOn: string; recipes: Recipe[] } | null>;
}
