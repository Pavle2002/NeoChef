import z from "zod";

export const DietSchema = z.object({
  name: z.string().trim(),
});

export type Diet = z.infer<typeof DietSchema>;
