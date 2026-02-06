import { readFile } from "fs/promises";
import path from "path";
import { CanonicalIngredientDataSchema } from "@neochef/common";
import { ingredientRepository } from "../services/index.js";

async function importCanonicalIngredients() {
  try {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const filePath = path.resolve(__dirname, "./canonical.json");
    const fileContent = await readFile(filePath, "utf-8");
    const rawData = JSON.parse(fileContent);

    const validIngredients =
      CanonicalIngredientDataSchema.array().parse(rawData);

    const total = validIngredients.reduce(
      (acc, item) => acc + 1 + (item.versions ? item.versions.length : 0),
      0,
    );
    console.log(
      `Total canonical ingredients to import (including versions): ${total}`,
    );

    if (!validIngredients.length) {
      console.error("No valid canonical ingredients to import.");
      return;
    }

    await ingredientRepository.createManyCanonical(validIngredients);
  } catch (err) {
    console.error("Failed to import canonical ingredients:", err);
  }
}

importCanonicalIngredients();
