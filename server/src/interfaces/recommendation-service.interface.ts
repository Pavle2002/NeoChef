import type { Recipe } from "@common/schemas/recipe.js";

export interface IRecommendationService {
  getTopPicks(userId: string): Promise<Recipe[]>;
  getFridgeBased(userId: string): Promise<Recipe[]>;
  getSimilarToLastLiked(
    userId: string
  ): Promise<{ basedOn: string; recipes: Recipe[] } | null>;
}
