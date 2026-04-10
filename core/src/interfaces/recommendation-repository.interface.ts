import type { Recipe } from "@neochef/common";

export interface IRecommendationRepository {
  findTopPicksBasic(userId: string): Promise<Recipe[]>;
  findFridgeBased(userId: string): Promise<Recipe[]>;
  findSimilarToLastLiked(
    userId: string,
  ): Promise<{ basedOn: string; recipes: Recipe[] } | null>;
  findTopPicksAdvanced(userId: string): Promise<Recipe[]>;
}
