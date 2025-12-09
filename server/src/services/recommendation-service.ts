import type { Recipe } from "@common/schemas/recipe.js";
import type { IRecommendationRepository } from "@interfaces/recommendation-repository.interface.js";
import type { IRecommendationService } from "@interfaces/recommendation-service.interface.js";

export class RecommendationService implements IRecommendationService {
  constructor(private recommendationRepository: IRecommendationRepository) {}

  async getTopPicks(userId: string): Promise<Recipe[]> {
    return this.recommendationRepository.findTopPicks(userId);
  }

  async getFridgeBased(userId: string): Promise<Recipe[]> {
    return this.recommendationRepository.findFridgeBased(userId);
  }

  async getSimilarToLastLiked(
    userId: string
  ): Promise<{ basedOn: string; recipes: Recipe[] } | null> {
    return this.recommendationRepository.findSimilarToLastLiked(userId);
  }
}
