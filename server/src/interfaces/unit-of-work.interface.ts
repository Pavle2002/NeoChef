import type { IUserRepository } from "@interfaces/user-repository.interface.js";
import type { IRecipeRepository } from "@interfaces/recipe-repository.interface.js";
import type { IIngredientRepository } from "@interfaces/ingredient-repository.interface.js";

export interface IUnitOfWork {
  users: IUserRepository;
  recipes: IRecipeRepository;
  ingredients: IIngredientRepository;

  // begin(): Promise<void>;
  // commit(): Promise<void>;
  // rollback(): Promise<void>;
  execute<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}
