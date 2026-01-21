import { Driver, ManagedTransaction, Session } from "neo4j-driver";
import { TransactionQueryExecutor } from "./transaction-query-executor.js";
import type { IUnitOfWork } from "../interfaces/unit-of-work.interface.js";
import type { IUserRepository } from "../interfaces/user-repository.interface.js";
import type { IRecipeRepository } from "../interfaces/recipe-repository.interface.js";
import type { IIngredientRepository } from "../interfaces/ingredient-repository.interface.js";
import { UserRepository } from "../repositories/user-repository.js";
import { RecipeRepository } from "../repositories/recipe-repository.js";
import { IngredientRepository } from "../repositories/ingredient-repository.js";

export class UnitOfWork implements IUnitOfWork {
  private session: Session;
  private transaction: ManagedTransaction | null = null;
  private queryExecutor: TransactionQueryExecutor | null = null;
  private _users: IUserRepository | null = null;
  private _recipes: IRecipeRepository | null = null;
  private _ingredients: IIngredientRepository | null = null;

  constructor(private driver: Driver) {
    this.session = this.driver.session();
  }

  get users(): IUserRepository {
    if (!this.queryExecutor) throw new Error("Transaction not started");
    return (this._users ??= new UserRepository(this.queryExecutor));
  }

  get recipes(): IRecipeRepository {
    if (!this.queryExecutor) throw new Error("Transaction not started");
    return (this._recipes ??= new RecipeRepository(this.queryExecutor));
  }

  get ingredients(): IIngredientRepository {
    if (!this.queryExecutor) throw new Error("Transaction not started");
    return (this._ingredients ??= new IngredientRepository(this.queryExecutor));
  }

  async execute<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    try {
      return await this.session.executeWrite((tx) => {
        this.transaction = tx;
        this.queryExecutor = new TransactionQueryExecutor(this.transaction);
        return work(this);
      });
    } finally {
      await this.session.close();
    }
  }
}
