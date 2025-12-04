import type { SafeUser } from "@common/schemas/user.js";
import type { Preferences } from "@common/schemas/preferences.js";
import type { IUserRepository } from "./user-repository.interface.js";
import type { Ingredient } from "@common/schemas/ingredient.js";

export interface IUserService {
  getById(id: string): Promise<SafeUser>;
  getByEmail(email: string): Promise<SafeUser>;
  //addLikesRecipe(userId: string, recipeId: string): Promise<void>;
  // addHasIngredient(userId: string, ingredientId: string): Promise<void>;

  getPreferences(
    userId: string,
    userRepository?: IUserRepository
  ): Promise<Preferences>;

  updatePreferences(
    userId: string,
    newPreferences: Preferences
  ): Promise<Preferences>;

  getFridge(
    userId: string,
    userRepository?: IUserRepository
  ): Promise<Ingredient[]>;

  updateFridge(
    userId: string,
    newIngredients: Ingredient[]
  ): Promise<Ingredient[]>;

  toggleLikesRecipe(
    userId: string,
    recipeId: string,
    likes: boolean
  ): Promise<void>;

  toggleSavedRecipe(
    userId: string,
    recipeId: string,
    save: boolean
  ): Promise<void>;
}
