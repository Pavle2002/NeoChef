import type { Recipe, RecommendationMode } from "@neochef/common";
import type { IRecipeService } from "@interfaces/recipe-service.interface.js";
import type { IRecommendationService } from "@interfaces/recommendation-service.interface.js";
import { CacheKeys } from "@utils/cache-keys.js";
import { safeAwait, type IRecommendationRepository } from "@neochef/core";
import type { RedisClientType } from "redis";

export class RecommendationService implements IRecommendationService {
  constructor(
    private readonly recommendationRepository: IRecommendationRepository,
    private readonly recipeService: IRecipeService,
    private readonly redisClient: RedisClientType<any, any, any>,
  ) {}

  async getTopPicks(
    userId: string,
    mode: RecommendationMode,
  ): Promise<Recipe[]> {
    const cacheKey = CacheKeys.recommendations.topPicks(userId, mode);

    const [error, cached] = await safeAwait(this.redisClient.get(cacheKey));
    if (!error && cached) {
      return JSON.parse(cached) as Recipe[];
    }

    let recipes =
      mode === "basic"
        ? await this.recommendationRepository.findTopPicksBasic(userId)
        : await this.recommendationRepository.findTopPicksAdvanced(userId);

    if (recipes.length === 0) {
      const trending = await this.recipeService.getTrending();
      recipes = trending.slice(0, 10);
    }

    await safeAwait(
      this.redisClient.setEx(
        cacheKey,
        CacheKeys.recommendations.TTL,
        JSON.stringify(recipes),
      ),
    );

    return recipes;
  }

  async getFridgeBased(userId: string): Promise<Recipe[]> {
    const cacheKey = CacheKeys.recommendations.fridge(userId);

    const [error, cached] = await safeAwait(this.redisClient.get(cacheKey));

    if (!error && cached) {
      return JSON.parse(cached) as Recipe[];
    }

    const recipes = await this.recommendationRepository.findFridgeBased(userId);

    await safeAwait(
      this.redisClient.setEx(
        cacheKey,
        CacheKeys.recommendations.TTL,
        JSON.stringify(recipes),
      ),
    );

    return recipes;
  }

  async getSimilarToLastLiked(
    userId: string,
    mode: RecommendationMode,
  ): Promise<{ lastLiked: Recipe; recipes: Recipe[] } | null> {
    const cacheKey = CacheKeys.recommendations.similar(userId, mode);

    const [error, cached] = await safeAwait(this.redisClient.get(cacheKey));

    if (!error && cached) {
      return JSON.parse(cached) as { lastLiked: Recipe; recipes: Recipe[] };
    }

    const result =
      mode === "basic"
        ? await this.recommendationRepository.findSimilarToLastLikedBasic(
            userId,
          )
        : await this.recommendationRepository.findSimilarToLastLikedAdvanced(
            userId,
          );

    await safeAwait(
      this.redisClient.setEx(
        cacheKey,
        CacheKeys.recommendations.TTL,
        JSON.stringify(result),
      ),
    );

    return result;
  }
}
