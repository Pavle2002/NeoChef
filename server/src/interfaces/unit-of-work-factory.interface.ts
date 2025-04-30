import type { IUnitOfWork } from "@interfaces/unit-of-work.interface.js";

export interface IUnitOfWorkFactory {
  create(): IUnitOfWork;
  execute<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}
