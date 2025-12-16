import type { Recipe } from "@neochef/common";
import type { ICacheService } from "@interfaces/cache-service.interface.js";
import type { IRecipeService } from "@interfaces/recipe-service.interface.js";
import type { IRecommendationRepository } from "@interfaces/recommendation-repository.interface.js";
import type { IRecommendationService } from "@interfaces/recommendation-service.interface.js";
import { CacheKeys } from "@utils/cache-keys.js";
import { safeAwait } from "@utils/safe-await.js";

export class RecommendationService implements IRecommendationService {
  constructor(
    private readonly recommendationRepository: IRecommendationRepository,
    private readonly recipeService: IRecipeService,
    private readonly cacheService: ICacheService
  ) {}

  async getTopPicks(userId: string): Promise<Recipe[]> {
    const cacheKey = CacheKeys.recommendations.topPicks(userId);

    const [error, cached] = await safeAwait(this.cacheService.get(cacheKey));
    if (!error && cached) {
      return JSON.parse(cached) as Recipe[];
    }

    let recipes = await this.recommendationRepository.findTopPicks(userId);

    if (recipes.length === 0) {
      const trending = await this.recipeService.getTrending();
      recipes = trending.slice(0, 10);
    }

    const TTL = await safeAwait(
      this.cacheService.setEx(
        cacheKey,
        CacheKeys.recommendations.TTL,
        JSON.stringify(recipes)
      )
    );

    return recipes;
  }

  async getFridgeBased(userId: string): Promise<Recipe[]> {
    const cacheKey = CacheKeys.recommendations.fridge(userId);

    const [error, cached] = await safeAwait(this.cacheService.get(cacheKey));

    if (!error && cached) {
      return JSON.parse(cached) as Recipe[];
    }

    const recipes = await this.recommendationRepository.findFridgeBased(userId);

    await safeAwait(
      this.cacheService.setEx(
        cacheKey,
        CacheKeys.recommendations.TTL,
        JSON.stringify(recipes)
      )
    );

    return recipes;
  }

  async getSimilarToLastLiked(
    userId: string
  ): Promise<{ basedOn: string; recipes: Recipe[] } | null> {
    const cacheKey = CacheKeys.recommendations.similar(userId);

    const [error, cached] = await safeAwait(this.cacheService.get(cacheKey));

    if (!error && cached) {
      return JSON.parse(cached) as { basedOn: string; recipes: Recipe[] };
    }

    const result =
      await this.recommendationRepository.findSimilarToLastLiked(userId);

    await safeAwait(
      this.cacheService.setEx(
        cacheKey,
        CacheKeys.recommendations.TTL,
        JSON.stringify(result)
      )
    );

    return result;
  }
}
