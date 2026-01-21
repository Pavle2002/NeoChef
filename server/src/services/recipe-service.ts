import type { IRecipeService } from "@interfaces/recipe-service.interface.js";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  type ExtendedRecipe,
  type Recipe,
  type RecipeFilters,
  type RecipeSortOptions,
} from "@neochef/common";
import { CacheKeys } from "@utils/cache-keys.js";
import {
  NotFoundError,
  safeAwait,
  type IRecipeRepository,
} from "@neochef/core";
import type { RedisClientType } from "redis";

export class RecipeService implements IRecipeService {
  constructor(
    private readonly recipeRepository: IRecipeRepository,
    private readonly redisClient: RedisClientType<any, any, any>,
  ) {}

  async getById(id: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) throw new NotFoundError(`Recipe with ID ${id} not found`);

    return recipe;
  }

  async getByIdExtended(id: string, userId: string): Promise<ExtendedRecipe> {
    const recipe = await this.recipeRepository.findByIdExtended(id, userId);
    if (!recipe) throw new NotFoundError(`Recipe with ID ${id} not found`);

    return recipe;
  }

  async getTrending(): Promise<Recipe[]> {
    const cacheKey = CacheKeys.recipes.trending;

    const [error, cached] = await safeAwait(
      this.redisClient.zRange(cacheKey, 0, DEFAULT_PAGE_SIZE - 1, {
        REV: true,
      }),
    );
    if (!error && cached && cached.length > 0) {
      return this.recipeRepository.findByIds(cached);
    }

    const result = await this.recipeRepository.findTrending();

    await safeAwait(this.redisClient.del(cacheKey));
    await safeAwait(
      Promise.all(
        result.map(({ recipe, score }) =>
          this.redisClient.zAdd(cacheKey, { score, value: recipe.id }),
        ),
      ),
    );
    await safeAwait(this.redisClient.expire(cacheKey, CacheKeys.recipes.TTL));
    return result.map((r) => r.recipe);
  }

  async getAll(
    limit: number = DEFAULT_PAGE_SIZE,
    offset: number = 0,
    filters: RecipeFilters = {},
    sortOptions: RecipeSortOptions = {
      sortBy: DEFAULT_SORT_BY,
      sortOrder: DEFAULT_SORT_ORDER,
    },
    search?: string,
  ): Promise<{ recipes: Recipe[]; totalCount: number }> {
    const [recipes, totalCount] = await Promise.all([
      this.recipeRepository.findAll(
        limit,
        offset,
        filters,
        sortOptions,
        search,
      ),
      this.recipeRepository.countAll(filters, search),
    ]);
    return { recipes, totalCount };
  }
}
