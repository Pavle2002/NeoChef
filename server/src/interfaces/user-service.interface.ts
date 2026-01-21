import type {
  Ingredient,
  Preferences,
  Recipe,
  SafeUser,
} from "@neochef/common";
import type { IUserRepository } from "@neochef/core";

export interface IUserService {
  getById(id: string): Promise<SafeUser>;
  getByEmail(email: string): Promise<SafeUser>;

  getPreferences(
    userId: string,
    userRepository?: IUserRepository,
  ): Promise<Preferences>;

  getFridge(
    userId: string,
    userRepository?: IUserRepository,
  ): Promise<Ingredient[]>;

  getSavedRecipes(userId: string): Promise<Recipe[]>;

  updatePreferences(
    userId: string,
    newPreferences: Preferences,
  ): Promise<Preferences>;

  updateFridge(
    userId: string,
    newIngredients: Ingredient[],
  ): Promise<Ingredient[]>;

  toggleLikesRecipe(
    userId: string,
    recipeId: string,
    likes: boolean,
  ): Promise<void>;

  toggleSavedRecipe(
    userId: string,
    recipeId: string,
    save: boolean,
  ): Promise<void>;
}
