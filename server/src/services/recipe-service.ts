import { NotFoundError } from "@errors/not-found-error.js";
import type { IRecipeRepository } from "@interfaces/recipe-repository.interface.js";
import type { IRecipeService } from "@interfaces/recipe-service.interface.js";
import type { Recipe, RecipeFilters } from "@common/schemas/recipe.js";

export class RecipeService implements IRecipeService {
  constructor(private readonly recipeRepository: IRecipeRepository) {}

  async getById(id: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) throw new NotFoundError(`Recipe with ID ${id} not found`);

    return recipe;
  }

  async getTrending(): Promise<Recipe[]> {
    return this.recipeRepository.findTrending();
  }

  async getAll(
    limit?: number,
    offset?: number,
    filters: RecipeFilters = {}
  ): Promise<{ recipes: Recipe[]; totalCount: number }> {
    const [recipes, totalCount] = await Promise.all([
      this.recipeRepository.findAll(limit, offset, filters),
      this.recipeRepository.countAll(filters),
    ]);
    return { recipes, totalCount };
  }
}
