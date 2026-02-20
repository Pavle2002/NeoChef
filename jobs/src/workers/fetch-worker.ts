import { Worker } from "bullmq";
import { config } from "../config/config.js";
import { limiter } from "../config/limiter.js";
import { ErrorCodes, type FetchJob } from "@neochef/common";
import { SpoonacularError } from "../errors/spoonacular-error.js";
import { QUEUES, type SpoonacularResponse } from "@neochef/core";
import { storageService, transformQueue, connection } from "../services.js";

const pageSize = 100;

export const fetchWorker = new Worker<FetchJob>(
  QUEUES.FETCH,
  async (job) => {
    const { page, correlationId } = job.data;

    const searchParams = {
      apiKey: config.spoonacular.apiKey,
      number: pageSize.toString(),
      offset: (page * pageSize).toString(),
      fillIngredients: "true",
      instructionsRequired: "true",
      addRecipeInformation: "true",
      addRecipeNutrition: "true",
      addRecipeInstructions: "true",
      sort: "popularity",
      sortDirection: "desc",
    };

    const url = `${config.spoonacular.baseUrl}/recipes/complexSearch?${new URLSearchParams(
      searchParams,
    )}`;

    const response = await limiter.schedule(() => fetch(url));

    if (!response.ok) {
      throw new SpoonacularError(
        "Failed to fetch recipes from Spoonacular",
        response.status,
        response.status === 402
          ? ErrorCodes.SPN_API_QUOTA
          : ErrorCodes.SPN_API_ERROR,
      );
    }

    const rawData = (await response.json()) as SpoonacularResponse;

    await storageService.uploadPage(page, rawData);

    await transformQueue.add("transform-job", {
      correlationId,
      page,
      type: "Transform",
    });
  },
  { connection },
);
