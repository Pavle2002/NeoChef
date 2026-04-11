import type { Recipe } from "@neochef/common";

export interface IRecommendationRepository {
  findTopPicksBasic(userId: string): Promise<Recipe[]>;
  findFridgeBased(userId: string): Promise<Recipe[]>;
  findSimilarToLastLikedBasic(
    userId: string,
  ): Promise<{ basedOn: string; recipes: Recipe[] } | null>;
  findTopPicksAdvanced(userId: string): Promise<Recipe[]>;
  findSimilarToLastLikedAdvanced(
    userId: string,
  ): Promise<{ basedOn: string; recipes: Recipe[] } | null>;
}
