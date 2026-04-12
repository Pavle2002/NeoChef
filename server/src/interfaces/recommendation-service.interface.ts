import type {
  Recipe,
  RecommendationMode,
  SimilarityExplanation,
} from "@neochef/common";

export interface IRecommendationService {
  getTopPicks(userId: string, mode: RecommendationMode): Promise<Recipe[]>;
  getSimilarToLastLiked(
    userId: string,
    mode: RecommendationMode,
  ): Promise<{ basedOn: string; recipes: Recipe[] } | null>;
  getFridgeBased(userId: string): Promise<Recipe[]>;
  getSimilarityExplanation(
    recipe1Id: string,
    recipe2Id: string,
  ): Promise<SimilarityExplanation>;
}
