import { Worker } from "bullmq";
import { QUEUES, upsertQueue } from "../config/queues.js";
import { connection } from "../config/queues.js";
import {
  ExtendedRecipeDataSchema,
  type Equipment,
  type ExtendedRecipeData,
  type RecipeData,
} from "@neochef/common";
import type { TransformJob } from "../types/job-types.js";

export const transformWorker = new Worker<TransformJob, ExtendedRecipeData[]>(
  QUEUES.TRANSFORM,
  async (job) => {
    const { rawData } = job.data;

    if (!Array.isArray(rawData.results)) {
      throw new Error("Invalid response format from Spoonacular API");
    }

    const results = ExtendedRecipeDataSchema.array().parse(
      rawData.results.map((recipe: any): any => {
        const nutrition = recipe.nutrition;
        const caloricBreakdown = nutrition?.caloricBreakdown;
        const weightPerServing = nutrition?.weightPerServing?.amount;
        const caloriesPerServing = nutrition?.nutrients?.find(
          (n: any) => n.name === "Calories",
        )?.amount;

        const instructions = recipe.analyzedInstructions?.[0]?.steps?.map(
          (s: any) => s.step,
        );

        const recipeData: RecipeData = {
          sourceId: recipe.id?.toString(),
          sourceName: "Spoonacular",
          title: recipe.title,
          imageType: recipe.imageType,
          servings: recipe.servings,
          pricePerServing: recipe.pricePerServing,
          weightPerServing,
          caloriesPerServing,
          readyInMinutes: recipe.readyInMinutes,
          healthScore: recipe.healthScore,
          summary: recipe.summary,
          instructions,
          percentCarbs: caloricBreakdown?.percentCarbs,
          percentFat: caloricBreakdown?.percentFat,
          percentProtein: caloricBreakdown?.percentProtein,
        };

        const cuisines = recipe.cuisines
          ?.filter(Boolean)
          .map((name: string) => ({ name }));

        const diets = recipe.diets
          ?.filter(Boolean)
          .map((name: string) => ({ name }));
        const dishTypes = recipe.dishTypes
          ?.filter(Boolean)
          .map((name: string) => ({ name }));

        const equipmentMap = new Map<string, Equipment>();
        (recipe.analyzedInstructions?.[0]?.steps ?? [])
          .flatMap((step: any) => step.equipment ?? [])
          .filter((e: any) => e?.id && e?.name)
          .forEach((e: any) => {
            equipmentMap.set(e.id.toString(), {
              sourceId: e.id.toString(),
              sourceName: "Spoonacular",
              name: e.name,
              image: extractImageName(e.image ?? ""),
            });
          });
        const equipment = Array.from(equipmentMap.values());

        const extendedIngredients = recipe.missedIngredients.map(
          (i: any): any => ({
            ingredientData: {
              sourceId: i.id?.toString(),
              sourceName: "Spoonacular",
              name: i.name,
              normalizedName: i.name,
              aisle: i.aisle,
              image: extractImageName(i.image ?? ""),
            },
            usage: {
              amount: i.amount,
              unit: i.unit,
              original: i.original,
            },
          }),
        );

        return {
          recipeData,
          cuisines,
          diets,
          dishTypes,
          equipment,
          extendedIngredients,
        };
      }),
    );

    upsertQueue.add("upsert-recipes", { recipes: results });
    return results;
  },
  { connection },
);

function extractImageName(url: string): string {
  return url.split("/").pop() || "";
}
