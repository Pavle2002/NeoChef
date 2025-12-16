import { NotFoundError } from "@errors/index.js";
import type { IUnitOfWorkFactory } from "@interfaces/unit-of-work-factory.interface.js";
import type { IUserRepository } from "@interfaces/user-repository.interface.js";
import type { IUserService } from "@interfaces/user-service.interface.js";
import type {
  Ingredient,
  Preferences,
  Recipe,
  SafeUser,
} from "@neochef/common";
import type { ICacheService } from "@interfaces/cache-service.interface.js";
import { safeAwait } from "@utils/safe-await.js";
import { CacheKeys } from "@utils/cache-keys.js";

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly uowFactory: IUnitOfWorkFactory,
    private readonly cacheService: ICacheService
  ) {}

  async getById(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError(`User with ID ${id} not found`);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async getByEmail(email: string): Promise<SafeUser> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundError(`User with email ${email} not found`);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async getPreferences(
    userId: string,
    userRepository = this.userRepository
  ): Promise<Preferences> {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError(`User with ID ${userId} not found`);

    const [dislikesIngredients, prefersCuisines, followsDiets] =
      await Promise.all([
        userRepository.getDislikedIngredients(userId),
        userRepository.getPreferredCuisines(userId),
        userRepository.getFollowedDiets(userId),
      ]);

    return {
      dislikesIngredients,
      prefersCuisines,
      followsDiets,
    };
  }

  async getFridge(
    userId: string,
    userRepository = this.userRepository
  ): Promise<Ingredient[]> {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError(`User with ID ${userId} not found`);

    return userRepository.getHasIngredients(userId);
  }

  async getSavedRecipes(userId: string): Promise<Recipe[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(`User with ID ${userId} not found`);

    return this.userRepository.getSavedRecipes(userId);
  }

  private async updateSet<T>(
    current: T[],
    next: T[],
    getKey: (item: T) => string,
    add: (key: string) => Promise<void>,
    remove: (key: string) => Promise<boolean>
  ): Promise<void> {
    const currentSet = new Set(current.map(getKey));
    const nextSet = new Set(next.map(getKey));

    const toRemove = [...currentSet].filter((key) => !nextSet.has(key));
    const toAdd = [...nextSet].filter((key) => !currentSet.has(key));

    for (const key of toRemove) {
      await remove(key);
    }
    for (const key of toAdd) {
      await add(key);
    }
  }

  async updatePreferences(
    userId: string,
    newPreferences: Preferences
  ): Promise<Preferences> {
    const updatedPreferences = await this.uowFactory.execute(async (uow) => {
      const current = await this.getPreferences(userId, uow.users);
      await this.updateSet(
        current.dislikesIngredients,
        newPreferences.dislikesIngredients,
        (i) => i.id,
        (id) => uow.users.addDislikesIngredient(userId, id),
        (id) => uow.users.removeDislikesIngredient(userId, id)
      );

      await this.updateSet(
        current.prefersCuisines,
        newPreferences.prefersCuisines,
        (c) => c.name,
        (name) => uow.users.addPrefersCuisine(userId, name),
        (name) => uow.users.removePrefersCuisine(userId, name)
      );

      await this.updateSet(
        current.followsDiets,
        newPreferences.followsDiets,
        (d) => d.name,
        (name) => uow.users.addFollowsDiet(userId, name),
        (name) => uow.users.removeFollowsDiet(userId, name)
      );

      return this.getPreferences(userId, uow.users);
    });

    await safeAwait(
      this.cacheService.del(CacheKeys.recommendations.topPicks(userId))
    );
    return updatedPreferences;
  }

  async updateFridge(
    userId: string,
    newIngredients: Ingredient[]
  ): Promise<Ingredient[]> {
    const fridge = await this.uowFactory.execute(async (uow) => {
      const current = await this.getFridge(userId, uow.users);
      await this.updateSet(
        current,
        newIngredients,
        (i) => i.id,
        (id) => uow.users.addHasIngredient(userId, id),
        (id) => uow.users.removeHasIngredient(userId, id)
      );

      return this.getFridge(userId, uow.users);
    });

    await safeAwait(
      this.cacheService.del(CacheKeys.recommendations.fridge(userId))
    );
    return fridge;
  }

  async toggleLikesRecipe(
    userId: string,
    recipeId: string,
    likes: boolean
  ): Promise<void> {
    if (likes) {
      await this.userRepository.addLikesRecipe(userId, recipeId);
    } else {
      await this.userRepository.removeLikesRecipe(userId, recipeId);
    }

    await safeAwait(
      Promise.all([
        this.cacheService.del(CacheKeys.recommendations.similar(userId)),
        this.cacheService.zIncrBy(
          CacheKeys.recipes.trending,
          likes ? 1 : -1,
          recipeId
        ),
      ])
    );
  }

  async toggleSavedRecipe(
    userId: string,
    recipeId: string,
    save: boolean
  ): Promise<void> {
    if (save) {
      await this.userRepository.addSavedRecipe(userId, recipeId);
    } else {
      await this.userRepository.removeSavedRecipe(userId, recipeId);
    }
    await safeAwait(
      this.cacheService.zIncrBy(
        CacheKeys.recipes.trending,
        save ? 2 : -2,
        recipeId
      )
    );
  }
}
