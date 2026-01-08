import z from "zod";

export const DishTypeSchema = z.object({
  name: z.string().trim(),
});

export type DishType = z.infer<typeof DishTypeSchema>;
