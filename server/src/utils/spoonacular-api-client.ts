import { SpoonacularQuotaExceededError } from "@errors/spoonacular-quota-exceeded-error.js";
import Bottleneck from "bottleneck";
import { extractImageName } from "@utils/extract-file-name.js";
import type { IApiClient } from "@interfaces/api-client.interface.js";
import {
  ExtendedRecipeDataSchema,
  type Equipment,
  type ExtendedRecipeData,
  type RecipeData,
} from "@neochef/common";
import type { RecipeSearchOptions } from "@app-types/import-types.js";
import { normalizeIngredientName } from "./normalize-ingredient-name.js";

export class SpoonacularApiClient implements IApiClient {
  private apiKey: string;
  private baseUrl: string;
  private rateLimiter: Bottleneck;

  constructor(apiKey: string, baseUrl: string, reqPerSecond: number = 1) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.rateLimiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 1000 / reqPerSecond,
    });
  }

  async searchRecipes(
    options: RecipeSearchOptions,
  ): Promise<ExtendedRecipeData[]> {
    const { cuisine, diet, type, number, offset } = options;

    const searchParams = {
      apiKey: this.apiKey,
      cuisine,
      diet,
      type,
      number: number.toString(),
      offset: offset.toString(),
      fillIngredients: "true",
      instructionsRequired: "true",
      addRecipeInformation: "true",
      addRecipeNutrition: "true",
      addRecipeInstructions: "true",
      sort: "popularity",
      sortDirection: "desc",
    };

    const url = `${this.baseUrl}/recipes/complexSearch?${new URLSearchParams(
      searchParams,
    )}`;

    const response = await this.rateLimiter.schedule(() => fetch(url));

    if (response.status === 402) {
      throw new SpoonacularQuotaExceededError("Exceeded daily quota");
    }
    if (!response.ok) {
      throw new Error(
        `Spoonacular API error: ${response.status} - ${response.statusText}`,
      );
    }

    const data = (await response.json()) as any;

    if (!Array.isArray(data.results)) {
      throw new Error("Invalid response format from Spoonacular API");
    }

    return ExtendedRecipeDataSchema.array().parse(
      data.results.map((recipe: any): any => {
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
  }
}
