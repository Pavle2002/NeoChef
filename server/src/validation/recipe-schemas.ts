import {
  DEFAULT_PAGE_SIZE,
  RecipeFiltersSchema,
  RecipeSortOptionsSchema,
} from "@neochef/common";
import { queryParamsParser } from "@utils/query-params-parser.js";
import { z } from "zod";

const { parseArray, parseNumber } = queryParamsParser;

const DEFAULT_OFFSET = 0;

const NormalizedRecipeFiltersSchema = RecipeFiltersSchema.extend({
  cuisines: z.preprocess(parseArray, z.array(z.string()).optional()),
  diets: z.preprocess(parseArray, z.array(z.string()).optional()),
  dishTypes: z.preprocess(parseArray, z.array(z.string()).optional()),
});

const getAllSchema = z.object({
  query: NormalizedRecipeFiltersSchema.merge(RecipeSortOptionsSchema).extend({
    limit: z
      .preprocess(
        parseNumber,
        z
          .number({ message: "Limit must be a number" })
          .int({ message: "Limit must be an integer" })
          .positive({ message: "Limit must be a positive integer" })
      )
      .default(DEFAULT_PAGE_SIZE),
    offset: z
      .preprocess(
        parseNumber,
        z
          .number({ message: "Offset must be a number" })
          .int({ message: "Offset must be an integer" })
          .nonnegative({ message: "Offset must be a non-negative integer" })
      )
      .default(DEFAULT_OFFSET),

    search: z.string().trim().optional(),
  }),
});

const getByIdSchema = z.object({
  params: z.object({
    id: z
      .string({
        required_error: "Id is required",
        invalid_type_error: "Id must be a string",
      })
      .uuid({ message: "Id must be a valid UUID" }),
  }),
});

export const recipeSchemas = {
  getAllSchema,
  getByIdSchema,
};
