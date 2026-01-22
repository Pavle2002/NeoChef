import { Worker } from "bullmq";
import { QUEUES } from "../config/queues.js";
import type { FetchJob } from "../types/job-types.js";
import { connection } from "../config/queues.js";
import { config } from "../config/config.js";
import { limiter } from "../config/limiter.js";
import { QuotaExceededError } from "../errors/quota-exceeded-error.js";
import { AppError } from "@neochef/core";
import { ErrorCodes } from "@neochef/common";

export const fetchWorker = new Worker<FetchJob>(
  QUEUES.FETCH,
  async (job) => {
    const { page, pageSize } = job.data;

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

    if (response.status === 402) {
      throw new QuotaExceededError("Daily Spoonacular quota exceeded");
    }

    if (!response.ok) {
      throw new AppError(
        `Spoonacular API error: ${response.status}`,
        500,
        ErrorCodes.API_ERROR,
      );
    }

    const rawData = await response.json();
    return rawData;
  },
  { connection },
);
