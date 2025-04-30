import type { IUnitOfWorkFactory } from "@interfaces/unit-of-work-factory.interface.js";
import type { IUnitOfWork } from "@interfaces/unit-of-work.interface.js";
import type { Driver } from "neo4j-driver";
import { UnitOfWork } from "./unit-of-work.js";

export class UnitOfWorkFactory implements IUnitOfWorkFactory {
  constructor(private driver: Driver) {}

  create(): IUnitOfWork {
    return new UnitOfWork(this.driver);
  }

  async execute<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    const uow = this.create();
    return uow.execute(work);
  }
}
