import { Worker } from "bullmq";
import {
  ErrorCodes,
  ExtendedRecipeDataSchema,
  type Equipment,
  type RecipeData,
} from "@neochef/common";
import type { TransformJob } from "../types/job-types.js";
import pluralize from "pluralize";
import { storageService } from "../services/index.js";
import { SpoonacularError } from "../errors/spoonacular-error.js";
import { QUEUES } from "@neochef/core";
import { connection, upsertQueue } from "../services/index.js";

export const transformWorker = new Worker<TransformJob>(
  QUEUES.TRANSFORM,
  async (job) => {
    const { page } = job.data;

    const rawData = await storageService.getPage(page);

    if (!Array.isArray(rawData.results)) {
      throw new SpoonacularError(
        "Invalid response format from Spoonacular API",
        500,
        ErrorCodes.SPN_API_ERROR,
      );
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
              normalizedName: normalizeIngredientName(i.name),
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

    const jobs = results.map((extendedRecipeData) => ({
      name: "upsert-recipes",
      data: { extendedRecipeData },
    }));

    upsertQueue.addBulk(jobs);
  },
  { connection },
);

function extractImageName(url: string): string {
  return url.split("/").pop() || "";
}

export function normalizeIngredientName(input: string): string {
  let name = input.toLowerCase().trim();

  // Remove parentheses content
  name = name.replace(/\([^)]*\)/g, " ");

  // Remove punctuation and numbers, preserving only Unicode letters and spaces
  name = name.replace(/[^\p{L}\s]/gu, " ");

  // Normalize whitespace
  name = name.replace(/\s+/g, " ").trim();

  // Singularize each word
  name = name
    .split(" ")
    .filter(Boolean)
    .map((word) => pluralize.singular(word))
    .join(" ");

  return name;
}
