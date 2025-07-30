import type { Diet } from "@common/schemas/diet.js";
import type { IDietRepository } from "@interfaces/diet-repository.interface.js";
import type { IDietService } from "@interfaces/diet-service.interface.js";

export class DietService implements IDietService {
  constructor(private readonly dietRepository: IDietRepository) {}

  async getAll(): Promise<Diet[]> {
    return this.dietRepository.findAll();
  }
}
