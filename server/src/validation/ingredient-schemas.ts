import { z } from "zod";

const getAllSchema = z.object({
  query: z.object({
    q: z
      .string({ invalid_type_error: "Query string must be a string" })
      .trim()
      .optional(),
  }),
});

export const ingredientSchemas = { getAllSchema };
