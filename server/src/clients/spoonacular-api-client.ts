import { SpoonacularQuotaExceededError } from "@errors/spoonacular-quota-exceeded-error.js";
import Bottleneck from "bottleneck";
import type { RecipeData } from "@common/schemas/recipe.js";
import type { ExtendedRecipeData } from "@common/schemas/recipe.js";
import { extractImageName } from "@utils/extract-file-name.js";
import type { ExtendedIngredientData } from "@common/schemas/ingredient.js";
import type { IApiClient } from "@interfaces/api-client.interface.js";
import type { Cuisine } from "@common/schemas/cuisine.js";
import type { Diet } from "@common/schemas/diet.js";
import type { DishType } from "@common/schemas/dish-type.js";
import type { Equipment } from "@common/schemas/equipment.js";
import type { RecipeSearchOptions } from "@app-types/import-types.js";

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
    options: RecipeSearchOptions
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
      sort: "meta-score",
      sortDirection: "desc",
    };

    const url = `${this.baseUrl}/recipes/complexSearch?${new URLSearchParams(
      searchParams
    )}`;

    const response = await this.rateLimiter.schedule(() => fetch(url));

    if (response.status === 402) {
      throw new SpoonacularQuotaExceededError("Exceeded daily quota");
    }
    if (!response.ok) {
      throw new Error(
        `Spoonacular API error: ${response.status} - ${response.statusText}`
      );
    }

    const data = (await response.json()) as any;

    if (!Array.isArray(data.results)) {
      throw new Error("Invalid response format from Spoonacular API");
    }

    return data.results.map((recipe: any): ExtendedRecipeData => {
      const nutrition = recipe.nutrition ?? {};
      const caloricBreakdown = nutrition.caloricBreakdown ?? {};
      const weightPerServing = nutrition.weightPerServing?.amount ?? 0;
      const caloriesPerServing =
        nutrition.nutrients?.find((n: any) => n.name === "Calories")?.amount ??
        0;

      const instructions =
        recipe.analyzedInstructions?.[0]?.steps?.map((s: any) => s.step) ?? [];

      const recipeData: RecipeData = {
        sourceId: recipe.id?.toString() ?? "",
        sourceName: "Spoonacular",
        title: recipe.title ?? "",
        imageType: recipe.imageType ?? "",
        servings: recipe.servings ?? 0,
        pricePerServing: recipe.pricePerServing ?? 0,
        weightPerServing,
        caloriesPerServing,
        readyInMinutes: recipe.readyInMinutes ?? 0,
        healthScore: recipe.healthScore ?? 0,
        spoonacularScore: recipe.spoonacularScore ?? 0,
        summary: recipe.summary ?? "",
        instructions,
        percentCarbs: caloricBreakdown.percentCarbs ?? 0,
        percentFat: caloricBreakdown.percentFat ?? 0,
        percentProtein: caloricBreakdown.percentProtein ?? 0,
      };

      const cuisines: Cuisine[] = (recipe.cuisines ?? [])
        .filter((name: string) => name)
        .map((name: string) => ({ name: name.trim() }));

      const diets: Diet[] = (recipe.diets ?? [])
        .filter((name: string) => name)
        .map((name: string) => ({ name: name.trim() }));

      const dishTypes: DishType[] = (recipe.dishTypes ?? [])
        .filter((name: string) => name)
        .map((name: string) => ({ name: name.trim() }));

      const equipmentMap = new Map<string, Equipment>();
      (recipe.analyzedInstructions?.[0]?.steps ?? [])
        .flatMap((step: any) => step.equipment ?? [])
        .filter((e: any) => e?.id && e?.name)
        .forEach((e: any) => {
          equipmentMap.set(e.id.toString(), {
            sourceId: e.id.toString(),
            sourceName: "Spoonacular",
            name: e.name.trim(),
            image: extractImageName(e.image ?? ""),
          });
        });
      const equipment = Array.from(equipmentMap.values());

      const extendedIngredients: ExtendedIngredientData[] = (
        recipe.missedIngredients ?? []
      )
        .filter((i: any) => i?.id && i?.name)
        .map(
          (i: any): ExtendedIngredientData => ({
            ingredientData: {
              sourceId: i.id.toString(),
              sourceName: "Spoonacular",
              name: i.name
                .split(". ")[0]
                .split(" to ")[0]
                .split(" but ")[0]
                .split(" or ")[0]
                .split(" if ")[0]
                .trim()
                .toLowerCase(),
              aisle: i.aisle ?? "",
              image: extractImageName(i.image ?? ""),
            },
            usage: {
              amount: i.amount ?? 0,
              unit: i.unit ?? "",
              original: i.original ?? "",
            },
          })
        );

      return {
        recipeData,
        cuisines,
        diets,
        dishTypes,
        equipment,
        extendedIngredients,
      };
    });
  }
}
