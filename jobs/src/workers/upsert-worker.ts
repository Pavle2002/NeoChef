import { Worker } from "bullmq";
import { QUEUES, connection } from "../config/queues.js";
import { UnitOfWorkFactory } from "@neochef/core";
import { neo4jClient } from "../config/neo4j.js";
import type { UpsertJob } from "../types/job-types.js";

const uowFactory = new UnitOfWorkFactory(neo4jClient);

export const upsertWorker = new Worker<UpsertJob, string[]>(
  QUEUES.UPSERT,
  async (job) => {
    const data = job.data.recipes;
    const succesfulUpserts: string[] = [];

    for (const recipeData of data) {
      const recipeId = await uowFactory.execute(async (uow) => {
        const recipe = await uow.recipes.createOrUpdate(recipeData.recipeData);

        for (const extendedIngredient of recipeData.extendedIngredients) {
          const ingredient = await uow.ingredients.create(
            extendedIngredient.ingredientData,
          );
          await uow.recipes.addIngredient(
            recipe.id,
            ingredient.id,
            extendedIngredient.usage,
          );
        }
        for (const cuisine of recipeData.cuisines) {
          await uow.recipes.addCuisine(recipe.id, cuisine);
        }
        for (const diet of recipeData.diets) {
          await uow.recipes.addDiet(recipe.id, diet);
        }
        for (const dishType of recipeData.dishTypes) {
          await uow.recipes.addDishType(recipe.id, dishType);
        }
        for (const equipment of recipeData.equipment) {
          await uow.recipes.addEquipment(recipe.id, equipment);
        }

        return recipe.id;
      });
      succesfulUpserts.push(recipeId);
    }

    return succesfulUpserts;
  },
  {
    connection,
  },
);
