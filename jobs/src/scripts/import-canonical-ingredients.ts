import { readFile } from "fs/promises";
import path from "path";
import { embeddingService, ingredientRepository } from "../services/index.js";
import { logger } from "../config/logger.js";
import type { CanonicalIngredientData } from "@neochef/common";

type CanonicalImport = {
  name: string;
  category: string;
  versions?: string[];
};

async function importCanonicalIngredients() {
  try {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const filePath = path.resolve(__dirname, "./canonical.json");
    const fileContent = await readFile(filePath, "utf-8");
    const canonicalIngredients: CanonicalImport[] = JSON.parse(fileContent);

    if (!canonicalIngredients.length) {
      logger.error("No canonical ingredients to import.");
      return;
    }

    let enrichedIngredients: CanonicalIngredientData[] = [];

    for (const ingredient of canonicalIngredients) {
      const embedding = await embeddingService.generateEmbedding(
        ingredient.name,
      );

      let versionEmbeddings: { name: string; embedding: number[] }[] = [];

      if (ingredient.versions) {
        for (const version of ingredient.versions) {
          const versionEmbedding =
            await embeddingService.generateEmbedding(version);

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

    await ingredientRepository.createManyCanonical(enrichedIngredients);
  } catch (err) {
    logger.error("Failed to import canonical ingredients:", err);
  }
}

importCanonicalIngredients();
