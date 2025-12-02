import { Driver, ManagedTransaction, Session } from "neo4j-driver";
import type { IUnitOfWork } from "@interfaces/unit-of-work.interface.js";
import type { IUserRepository } from "@interfaces/user-repository.interface.js";
import type { IRecipeRepository } from "@interfaces/recipe-repository.interface.js";
import type { IIngredientRepository } from "@interfaces/ingredient-repository.interface.js";
import { UserRepository } from "@repositories/user-repository.js";
import { RecipeRepository } from "@repositories/recipe-repository.js";
import { IngredientRepository } from "@repositories/ingredient-repository.js";
import { TransactionQueryExecutor } from "./transaction-query-executor.js";

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

  // async begin(): Promise<void> {
  //   this.transaction = this.session.beginTransaction();
  //   this.queryExecutor = new TransactionQueryExecutor(this.transaction);
  // }

  // async commit(): Promise<void> {
  //   if (this.transaction) {
  //     await this.transaction.commit();
  //   }
  //   await this.session.close();
  // }

  // async rollback(): Promise<void> {
  //   if (this.transaction) {
  //     await this.transaction.rollback();
  //   }
  //   await this.session.close();
  // }

  // async execute<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
  //   await this.begin();
  //   try {
  //     const result = await work(this);
  //     await this.commit();
  //     return result;
  //   } catch (error) {
  //     await this.rollback();
  //     throw error;
  //   }
  // }
}
