import type { UserData } from "@common/schemas/user.js";
import type { Cuisine } from "@common/schemas/cuisine.js";
import type { Diet } from "@common/schemas/diet.js";
import type { Ingredient } from "@common/schemas/ingredient.js";
import type { User } from "@common/schemas/user.js";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;

  create(user: UserData): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;

  addLikesRecipe(userId: string, recipeId: string): Promise<void>;
  addHasIngredient(userId: string, ingredientId: string): Promise<void>;
  addDislikesIngredient(userId: string, ingredientId: string): Promise<void>;
  addPrefersCuisine(userId: string, cuisineName: string): Promise<void>;
  addFollowsDiet(userId: string, dietName: string): Promise<void>;

  removeLikesRecipe(userId: string, recipeId: string): Promise<boolean>;
  removeHasIngredient(userId: string, ingredientId: string): Promise<boolean>;
  removeDislikesIngredient(
    userId: string,
    ingredientId: string
  ): Promise<boolean>;
  removePrefersCuisine(userId: string, cuisineName: string): Promise<boolean>;
  removeFollowsDiet(userId: string, dietName: string): Promise<boolean>;

  getFollowedDiets(userId: string): Promise<Diet[]>;
  getPreferredCuisines(userId: string): Promise<Cuisine[]>;
  getDislikedIngredients(userId: string): Promise<Ingredient[]>;
}
