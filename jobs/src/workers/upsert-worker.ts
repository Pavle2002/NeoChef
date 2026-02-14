import { Worker } from "bullmq";
import { uowFactory } from "../services/index.js";
import { QUEUES } from "@neochef/core";
import { connection } from "../services/index.js";
import type { UpsertJob } from "@neochef/common";

export const upsertWorker = new Worker<UpsertJob, string>(
  QUEUES.UPSERT,
  async (job) => {
    const { extendedRecipeData } = job.data;

    const recipeId = await uowFactory.execute(async (uow) => {
      const recipe = await uow.recipes.createOrUpdate(
        extendedRecipeData.recipeData,
      );

      for (const extendedIngredient of extendedRecipeData.extendedIngredients) {
        const ingredient = await uow.ingredients.create(
          extendedIngredient.ingredientData,
        );

        const bestMatch = (
          await uow.ingredients.findSimilarCanonical(ingredient.embedding, 1)
        )[0];

        if (bestMatch && bestMatch.confidence > 0.8) {
          await uow.ingredients.addCanonical(
            ingredient.id,
            bestMatch.match.id,
            bestMatch.confidence,
          );
        }

        await uow.recipes.addIngredient(
          recipe.id,
          ingredient.id,
          extendedIngredient.usage,
        );
      }
      for (const cuisine of extendedRecipeData.cuisines) {
        await uow.recipes.addCuisine(recipe.id, cuisine);
      }
      for (const diet of extendedRecipeData.diets) {
        await uow.recipes.addDiet(recipe.id, diet);
      }
      for (const dishType of extendedRecipeData.dishTypes) {
        await uow.recipes.addDishType(recipe.id, dishType);
      }
      for (const equipment of extendedRecipeData.equipment) {
        await uow.recipes.addEquipment(recipe.id, equipment);
      }

      return recipe.id;
    });

    return recipeId;
  },
  {
    connection,
    concurrency: 10,
  },
);
