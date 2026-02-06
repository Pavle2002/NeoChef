import { ErrorCodes, type CanonicalIngredient } from "@neochef/common";
import { AppError, type IIngredientRepository } from "@neochef/core";
import Fuse from "fuse.js";

type MatchResult = { id: string; confidence: number } | null;

interface ICanonicalMatcher {
  findCanonicalMatch(name: string): MatchResult;
  loadCanonical(): Promise<void>;
}

export class CanonicalMatcher implements ICanonicalMatcher {
  private canonicalIngredients: CanonicalIngredient[] = [];
  private fuzzyMatcher: Fuse<CanonicalIngredient> | null = null;

  constructor(private readonly ingredientRepository: IIngredientRepository) {}

  findCanonicalMatch(ingredientName: string): MatchResult {
    if (!this.fuzzyMatcher || this.canonicalIngredients.length === 0)
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

    const result = this.fuzzyMatcher.search(ingredientName);

    if (result.length > 0) {
      const bestMatch = result.at(0);
      const score = 1 - bestMatch!.score!;
      if (score >= 0.8) return { id: bestMatch!.item.id, confidence: score };
    }

    return null;
  }

  async loadCanonical(): Promise<void> {
    this.canonicalIngredients =
      await this.ingredientRepository.findAllCanonical();
    this.fuzzyMatcher = new Fuse(this.canonicalIngredients, {
      keys: ["name"],
      includeScore: true,
      shouldSort: true,
    });
  }
}
