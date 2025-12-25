import { NotFoundError } from "@errors/not-found-error.js";
import type { IRecipeRepository } from "@interfaces/recipe-repository.interface.js";
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
import type { ICacheService } from "@interfaces/cache-service.interface.js";
import { CacheKeys } from "@utils/cache-keys.js";
import { safeAwait } from "@utils/safe-await.js";

export class RecipeService implements IRecipeService {
  constructor(
    private readonly recipeRepository: IRecipeRepository,
    private readonly cacheService: ICacheService
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
      this.cacheService.zRange(cacheKey, 0, DEFAULT_PAGE_SIZE - 1)
    );
    if (!error && cached && cached.length > 0) {
      return this.recipeRepository.findByIds(cached);
    }

    const result = await this.recipeRepository.findTrending();

    await safeAwait(this.cacheService.del(cacheKey));
    await safeAwait(
      Promise.all(
        result.map(({ recipe, score }) =>
          this.cacheService.zAdd(cacheKey, score, recipe.id)
        )
      )
    );
    await safeAwait(this.cacheService.expire(cacheKey, CacheKeys.recipes.TTL));

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
    search?: string
  ): Promise<{ recipes: Recipe[]; totalCount: number }> {
    const [recipes, totalCount] = await Promise.all([
      this.recipeRepository.findAll(
        limit,
        offset,
        filters,
        sortOptions,
        search
      ),
      this.recipeRepository.countAll(filters, search),
    ]);
    return { recipes, totalCount };
  }
}
