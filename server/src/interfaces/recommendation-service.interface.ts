import type { Recipe } from "@neochef/common";

export interface IRecommendationService {
  getTopPicks(userId: string): Promise<Recipe[]>;
  getFridgeBased(userId: string): Promise<Recipe[]>;
  getSimilarToLastLiked(
    userId: string
  ): Promise<{ basedOn: string; recipes: Recipe[] } | null>;
}
