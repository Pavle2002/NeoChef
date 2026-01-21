import type {
  Cuisine,
  Diet,
  Ingredient,
  Recipe,
  User,
  UserData,
} from "@neochef/common";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;

  create(user: UserData): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;

  getFollowedDiets(userId: string): Promise<Diet[]>;
  getPreferredCuisines(userId: string): Promise<Cuisine[]>;
  getDislikedIngredients(userId: string): Promise<Ingredient[]>;
  getHasIngredients(userId: string): Promise<Ingredient[]>;
  getSavedRecipes(userId: string): Promise<Recipe[]>;

  addLikesRecipe(userId: string, recipeId: string): Promise<void>;
  addSavedRecipe(userId: string, recipeId: string): Promise<void>;
  addHasIngredient(userId: string, ingredientId: string): Promise<void>;
  addDislikesIngredient(userId: string, ingredientId: string): Promise<void>;
  addPrefersCuisine(userId: string, cuisineName: string): Promise<void>;
  addFollowsDiet(userId: string, dietName: string): Promise<void>;

  removeLikesRecipe(userId: string, recipeId: string): Promise<boolean>;
  removeSavedRecipe(userId: string, recipeId: string): Promise<boolean>;
  removeHasIngredient(userId: string, ingredientId: string): Promise<boolean>;
  removeDislikesIngredient(
    userId: string,
    ingredientId: string
  ): Promise<boolean>;
  removePrefersCuisine(userId: string, cuisineName: string): Promise<boolean>;
  removeFollowsDiet(userId: string, dietName: string): Promise<boolean>;
}
