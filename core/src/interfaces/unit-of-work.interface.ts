import type { IIngredientRepository } from "./ingredient-repository.interface.js";
import type { IRecipeRepository } from "./recipe-repository.interface.js";
import type { IUserRepository } from "./user-repository.interface.js";

export interface IUnitOfWork {
  users: IUserRepository;
  recipes: IRecipeRepository;
  ingredients: IIngredientRepository;

  execute<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}
