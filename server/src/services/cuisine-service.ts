import type { Cuisine } from "@common/schemas/cuisine.js";
import type { ICuisineRepository } from "@interfaces/cuisine-repository.interface.js";
import type { ICuisineService } from "@interfaces/cuisine-service.interface.js";

export class CuisineService implements ICuisineService {
  constructor(private readonly cuisineRepository: ICuisineRepository) {}

  async getAll(): Promise<Cuisine[]> {
    return this.cuisineRepository.findAll();
  }
}
