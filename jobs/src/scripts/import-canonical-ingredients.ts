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

    const rootEmbeddings = await embeddingService.generateEmbeddings(
      canonicalIngredients.map((ing) => ing.name),
    );

    const enrichedIngredients: CanonicalIngredientData[] =
      canonicalIngredients.map((ingredient, index) => ({
        name: ingredient.name,
        category: ingredient.category,
        embedding: rootEmbeddings[index]!,
      }));

    for (let i = 0; i < canonicalIngredients.length; i++) {
      const versions = canonicalIngredients[i]!.versions;
      if (versions) {
        const versionEmbeddings =
          await embeddingService.generateEmbeddings(versions);

        enrichedIngredients[i]!.versions = versions.map((v, ind) => ({
          name: v,
          embedding: versionEmbeddings[ind]!,
        }));
      }
    }

    await ingredientRepository.createManyCanonical(enrichedIngredients);
  } catch (err) {
    logger.error("Failed to import canonical ingredients:", err);
  }
}

importCanonicalIngredients();
