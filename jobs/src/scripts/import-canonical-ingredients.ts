import { readFile } from "fs/promises";
import path from "path";
import { CanonicalIngredientDataSchema } from "@neochef/common";
import { embeddingService, ingredientRepository } from "../services/index.js";
import { logger } from "../config/logger.js";

async function importCanonicalIngredients() {
  try {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const filePath = path.resolve(__dirname, "./canonical.json");
    const fileContent = await readFile(filePath, "utf-8");
    const rawData = JSON.parse(fileContent);

    const validIngredients =
      CanonicalIngredientDataSchema.array().parse(rawData);

    const embeddings = await embeddingService.generateEmbeddings(
      validIngredients.map((ing) => ing.name),
    );

    validIngredients.forEach((ingredient, index) => {
      ingredient.embedding = embeddings[index]!;
    });

    if (!validIngredients.length) {
      logger.error("No valid canonical ingredients to import.");
      return;
    }

    await ingredientRepository.createManyCanonical(validIngredients);
  } catch (err) {
    logger.error("Failed to import canonical ingredients:", err);
  }
}

importCanonicalIngredients();
