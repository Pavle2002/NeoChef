import type { Recipe } from "@common/schemas/recipe.js";
import type { IRecommendationRepository } from "@interfaces/recommendation-repository.interface.js";
import type { IRecommendationService } from "@interfaces/recommendation-service.interface.js";

export class RecommendationService implements IRecommendationService {
  constructor(private recommendationRepository: IRecommendationRepository) {}

  async getRecommendedRecipes(userId: string): Promise<Recipe[]> {
    return this.recommendationRepository.findRecommendedRecipes(userId);
  }
}
