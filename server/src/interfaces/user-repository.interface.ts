import type { RegisterInput } from "@app-types/auth-types.js";
import type { User } from "@models/user.js";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: RegisterInput): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  addLikesRecipe(userId: string, recipeId: string): Promise<void>;
  addHasIngredient(userId: string, ingredientId: string): Promise<void>;
  addDislikesIngredient(userId: string, ingredientId: string): Promise<void>;
  addPrefersCuisine(userId: string, cuisineName: string): Promise<void>;
  addFollowsDiet(userId: string, dietName: string): Promise<void>;
}
