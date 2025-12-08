import type { Recipe } from "@common/schemas/recipe.js";

export interface IRecommendationService {
  getRecommendedRecipes(userId: string): Promise<Recipe[]>;
}
