import type { IRecipeRepository } from "@interfaces/recipe-repository.interface.js";
import type { IRecipeService } from "@interfaces/recipe-service.interface.js";
import type { Recipe } from "@models/recipe.js";

export class RecipeService implements IRecipeService {
  constructor(private recipeRepository: IRecipeRepository) {}

  async findTrending(): Promise<Recipe[]> {
    return this.recipeRepository.findTrending();
  }

  async findAll(
    limit?: number,
    offset?: number
  ): Promise<{ recipes: Recipe[]; totalCount: number }> {
    const [recipes, totalCount] = await Promise.all([
      this.recipeRepository.findAll(limit, offset),
      this.recipeRepository.countAll(),
    ]);
    return { recipes, totalCount };
  }

  async findById(id: string): Promise<Recipe | null> {
    return this.recipeRepository.findById(id);
  }
}
