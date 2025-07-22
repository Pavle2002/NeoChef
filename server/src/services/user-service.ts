import type { SafeUser } from "@app-types/auth-types.js";
import type { IUserRepository } from "@interfaces/user-repository.interface.js";
import type { IUserService } from "@interfaces/user-service.interface.js";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async findByUsername(username: string): Promise<SafeUser | null> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async findByEmail(email: string): Promise<SafeUser | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async addLikesRecipe(userId: string, recipeId: string): Promise<void> {
    return this.userRepository.addLikesRecipe(userId, recipeId);
  }

  async addHasIngredient(userId: string, ingredientId: string): Promise<void> {
    return this.userRepository.addHasIngredient(userId, ingredientId);
  }

  async addDislikesIngredient(
    userId: string,
    ingredientId: string
  ): Promise<void> {
    return this.userRepository.addDislikesIngredient(userId, ingredientId);
  }

  async addPrefersCuisine(userId: string, cuisineName: string): Promise<void> {
    return this.userRepository.addPrefersCuisine(userId, cuisineName);
  }

  async addFollowsDiet(userId: string, dietName: string): Promise<void> {
    return this.userRepository.addFollowsDiet(userId, dietName);
  }
}
