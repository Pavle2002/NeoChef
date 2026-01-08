import { z } from "zod";

export const EquipmentSchema = z.object({
  name: z.string().trim(),
  sourceId: z.string(),
  sourceName: z.string(),
  image: z.string(),
});

export type Equipment = z.infer<typeof EquipmentSchema>;
