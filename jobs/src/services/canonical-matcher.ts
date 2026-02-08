import { ErrorCodes, type CanonicalIngredient } from "@neochef/common";
import { AppError, type IIngredientRepository } from "@neochef/core";
import type { IEmbeddingService } from "./embedding-service.js";
import type { MatchResult } from "../types/match-result.js";

interface ICanonicalMatcher {
  findCanonicalMatch(name: string): Promise<MatchResult | null>;
  loadCanonical(): Promise<void>;
}

export class CanonicalMatcher implements ICanonicalMatcher {
  private canonicalIngredients: CanonicalIngredient[] = [];

  constructor(
    private readonly ingredientRepository: IIngredientRepository,
    private readonly embeddingService: IEmbeddingService,
  ) {}

  async findCanonicalMatch(
    ingredientName: string,
  ): Promise<MatchResult | null> {
    if (this.canonicalIngredients.length === 0)
      throw new AppError(
        "Canonical ingredients not loaded",
        500,
        ErrorCodes.SYS_INTERNAL_ERROR,
      );

    const match = this.canonicalIngredients.find(
      (canonical) =>
        canonical.name.toLowerCase() === ingredientName.toLowerCase(),
    );
    if (match) return { id: match.id, confidence: 1 };

    const matches = await this.embeddingService.findMatches(ingredientName);
    const bestMatch = matches.at(0)!;
    if (bestMatch.confidence > 0.6) return bestMatch;

    return null;
  }

  async loadCanonical(): Promise<void> {
    this.canonicalIngredients =
      await this.ingredientRepository.findAllCanonical();

    await this.embeddingService.loadCandidates(this.canonicalIngredients);
  }
}
