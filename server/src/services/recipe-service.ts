import type { IRecipeService } from "@interfaces/recipe-service.interface.js";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  type ExtendedRecipe,
  type ExtendedRecipeData,
  type Recipe,
  type RecipeFilters,
  type RecipeSortOptions,
  type SimilarityExplanation,
} from "@neochef/common";
import { CacheKeys } from "@utils/cache-keys.js";
import {
  NotFoundError,
  safeAwait,
  type IEmbeddingService,
  type IRecipeRepository,
  type IUnitOfWorkFactory,
} from "@neochef/core";
import type { RedisClientType } from "redis";

export class RecipeService implements IRecipeService {
  constructor(
    private readonly recipeRepository: IRecipeRepository,
    private readonly redisClient: RedisClientType<any, any, any>,
    private readonly embeddingService: IEmbeddingService,
    private readonly uowFactory: IUnitOfWorkFactory,
  ) {}

  async create(extendedRecipeData: ExtendedRecipeData): Promise<Recipe> {
    return await this.uowFactory.execute(async (uow) => {
      const recipe = await uow.recipes.create(extendedRecipeData.recipeData);

      for (const extendedIngredient of extendedRecipeData.extendedIngredients) {
        const ingredient = await uow.ingredients.create(
          extendedIngredient.ingredientData,
        );

        const bestMatch = (
          await uow.ingredients.findSimilarCanonical(ingredient.id, 1)
        )[0];

        if (bestMatch && bestMatch.confidence > 0.8) {
          await uow.ingredients.addCanonical(
            ingredient.id,
            bestMatch.match.id,
            bestMatch.confidence,
          );
        }

        await uow.recipes.addIngredient(
          recipe.id,
          ingredient.id,
          extendedIngredient.usage,
        );
      }

      for (const cuisine of extendedRecipeData.cuisines) {
        await uow.recipes.addCuisine(recipe.id, cuisine);
      }
      for (const diet of extendedRecipeData.diets) {
        await uow.recipes.addDiet(recipe.id, diet);
      }
      for (const dishType of extendedRecipeData.dishTypes) {
        await uow.recipes.addDishType(recipe.id, dishType);
      }
      for (const equipment of extendedRecipeData.equipment) {
        await uow.recipes.addEquipment(recipe.id, equipment);
      }

      return recipe;
    });
  }

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
    searchQuery?: string,
  ): Promise<{ recipes: Recipe[]; totalCount: number }> {
    let searchEmbedding: number[] | undefined = undefined;

    if (searchQuery) {
      searchEmbedding = await this.embeddingService.getEmbedding(
        searchQuery.toLowerCase(),
      );
    }

    const [recipes, totalCount] = await Promise.all([
      this.recipeRepository.findAll(
        limit,
        offset,
        filters,
        sortOptions,
        searchEmbedding,
      ),
      this.recipeRepository.countAll(filters, searchEmbedding),
    ]);
    return { recipes, totalCount };
  }

  async getSimilarRecipes(id: string, limit: number): Promise<Recipe[]> {
    return await this.recipeRepository.findSimilarRecipes(id, limit);
  }

  async getSimilarityExplanation(
    id1: string,
    id2: string,
  ): Promise<SimilarityExplanation> {
    return await this.recipeRepository.findSimilarityExplanation(id1, id2);
  }
}
