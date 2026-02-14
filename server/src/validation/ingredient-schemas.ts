import { queryParamsParser } from "@utils/query-params-parser.js";
import { z } from "zod";

const getAllCanonicalSchema = z.object({
  query: z.object({
    q: z
      .string({ invalid_type_error: "Query string must be a string" })
      .trim()
      .optional(),
  }),
});

const getSimilarCanonicalSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid ingredient ID format" }),
  }),
  query: z.object({
    limit: z.preprocess(
      queryParamsParser.parseNumber,
      z
        .number()
        .int({ message: "Limit must be an integer" })
        .positive({ message: "Limit must be a positive number" })
        .max(20, { message: "Limit cannot exceed 20" })
        .optional(),
    ),
  }),
});

export const ingredientSchemas = {
  getAllCanonicalSchema,
  getSimilarCanonicalSchema,
};
