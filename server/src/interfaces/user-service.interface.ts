import type { SafeUser } from "@app-types/auth-types.js";

export interface IUserService {
  findById(id: string): Promise<SafeUser | null>;
  findByUsername(username: string): Promise<SafeUser | null>;
  findByEmail(email: string): Promise<SafeUser | null>;
  addLikesRecipe(userId: string, recipeId: string): Promise<void>;
  addHasIngredient(userId: string, ingredientId: string): Promise<void>;
  addDislikesIngredient(userId: string, ingredientId: string): Promise<void>;
  addPrefersCuisine(userId: string, cuisineName: string): Promise<void>;
  addFollowsDiet(userId: string, dietName: string): Promise<void>;
}
