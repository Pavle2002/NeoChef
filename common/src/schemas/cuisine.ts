import z from "zod";

export const CuisineSchema = z.object({
  name: z.string(),
});

export type Cuisine = z.infer<typeof CuisineSchema>;
