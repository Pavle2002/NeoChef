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
  // addLikedRecipe(id: string, recipeId: string): Promise<void>;
  // addHasIngredient(id: string, ingredientId: string): Promise<void>;
  // addDislikesIngredient(id: string, ingredientId: string): Promise<void>;
  // addPrefersCuisine(id: string, cuisineName: string): Promise<void>;
  // addFollowsDiet(id: string, dietName: string): Promise<void>;
}
