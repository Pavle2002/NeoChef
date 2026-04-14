import type { IIngredientService } from "@interfaces/ingredient-service.interface.js";
import type {
  CanonicalImport,
  CanonicalIngredient,
  CanonicalIngredientData,
  Ingredient,
  MatchResult,
} from "@neochef/common";
import {
  InternalServerError,
  type IEmbeddingService,
  type IIngredientRepository,
} from "@neochef/core";
import { readFile } from "fs/promises";
import path from "path";

export class IngredientService implements IIngredientService {
  constructor(
    private readonly ingredientRepository: IIngredientRepository,
    private readonly embeddingService: IEmbeddingService,
  ) {}

  async getAllCanonical(queryString = ""): Promise<CanonicalIngredient[]> {
    return this.ingredientRepository.findAllCanonical(queryString);
  }

  async getAllUnmapped(): Promise<Ingredient[]> {
    return this.ingredientRepository.findAllUnmapped();
  }

  async getSimilarCanonical(
    ingredientId: string,
    limit = 5,
  ): Promise<MatchResult[]> {
    return this.ingredientRepository.findSimilarCanonical(ingredientId, limit);
  }

  async addCanonical(
    ingredientId: string,
    canonicalId: string,
    confidence: number,
  ): Promise<void> {
    await this.ingredientRepository.addCanonical(
      ingredientId,
      canonicalId,
      confidence,
    );
  }

  async importCanonical(filePath: string): Promise<void> {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const resolvedPath = path.resolve(__dirname, filePath);
    const fileContent = await readFile(resolvedPath, "utf-8");
    const canonicalIngredients: CanonicalImport[] = JSON.parse(fileContent);

    if (!canonicalIngredients.length) {
      throw new InternalServerError("No canonical ingredients to import.");
    }

    let enrichedIngredients: CanonicalIngredientData[] = [];

    for (const ingredient of canonicalIngredients) {
      const embedding = await this.embeddingService.getEmbedding(
        ingredient.name,
      );

      let versionEmbeddings: { name: string; embedding: number[] }[] = [];

      if (ingredient.versions) {
        for (const version of ingredient.versions) {
          const versionEmbedding =
            await this.embeddingService.getEmbedding(version);

          versionEmbeddings.push({
            name: version,
            embedding: versionEmbedding,
          });
        }
      }

      enrichedIngredients.push({
        name: ingredient.name,
        category: ingredient.category,
        embedding,
        versions: versionEmbeddings.length > 0 ? versionEmbeddings : undefined,
      });
    }

    await this.ingredientRepository.createManyCanonical(enrichedIngredients);
  }
}
