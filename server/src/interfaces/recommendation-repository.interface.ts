import type { Recipe } from "@common/schemas/recipe.js";

export interface IRecommendationRepository {
  findTopPicks(userId: string): Promise<Recipe[]>;
  findFridgeBased(userId: string): Promise<Recipe[]>;
  findSimilarToLastLiked(
    userId: string
  ): Promise<{ basedOn: string; recipes: Recipe[] } | null>;
}
