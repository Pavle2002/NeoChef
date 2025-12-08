import type { Recipe } from "@common/schemas/recipe.js";

export interface IRecommendationRepository {
  findRecommendedRecipes(userId: string): Promise<Recipe[]>;
}
