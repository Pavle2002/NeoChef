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
} from "@common/schemas/recipe.js";

export class RecipeService implements IRecipeService {
  constructor(private readonly recipeRepository: IRecipeRepository) {}

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
    return this.recipeRepository.findTrending();
  }

  async getAll(
    limit: number = DEFAULT_PAGE_SIZE,
    offset: number = 0,
    filters: RecipeFilters = {},
    sortOptions: RecipeSortOptions = {
      sortBy: DEFAULT_SORT_BY,
      sortOrder: DEFAULT_SORT_ORDER,
    }
  ): Promise<{ recipes: Recipe[]; totalCount: number }> {
    const [recipes, totalCount] = await Promise.all([
      this.recipeRepository.findAll(limit, offset, filters, sortOptions),
      this.recipeRepository.countAll(filters),
    ]);
    return { recipes, totalCount };
  }
}
