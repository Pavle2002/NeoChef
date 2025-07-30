import type { SafeUser } from "@common/schemas/user.js";
import type { Preferences } from "@common/schemas/preferences.js";
import type { IUserRepository } from "./user-repository.interface.js";

export interface IUserService {
  getById(id: string): Promise<SafeUser>;
  getByEmail(email: string): Promise<SafeUser>;
  addLikesRecipe(userId: string, recipeId: string): Promise<void>;
  addHasIngredient(userId: string, ingredientId: string): Promise<void>;

  getPreferences(
    userId: string,
    userRepository?: IUserRepository
  ): Promise<Preferences>;

  updatePreferences(
    userId: string,
    newPreferences: Preferences
  ): Promise<Preferences>;
}
