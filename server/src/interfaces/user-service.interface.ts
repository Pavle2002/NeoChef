import type { SafeUser } from "@common/schemas/user.js";
import type { Preferences } from "@common/schemas/preferences.js";
import type { IUserRepository } from "./user-repository.interface.js";
import type { Ingredient } from "@common/schemas/ingredient.js";
import type { Recipe } from "@common/schemas/recipe.js";

export interface IUserService {
  getById(id: string): Promise<SafeUser>;
  getByEmail(email: string): Promise<SafeUser>;

  getPreferences(
    userId: string,
    userRepository?: IUserRepository
  ): Promise<Preferences>;

  getFridge(
    userId: string,
    userRepository?: IUserRepository
  ): Promise<Ingredient[]>;

  getSavedRecipes(userId: string): Promise<Recipe[]>;

  updatePreferences(
    userId: string,
    newPreferences: Preferences
  ): Promise<Preferences>;

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
