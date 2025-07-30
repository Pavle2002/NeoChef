import { z } from "zod";
export const EquipmentSchema = z.object({
    name: z.string(),
    sourceId: z.string(),
    sourceName: z.string(),
    image: z.string(),
});
//# sourceMappingURL=equipment.js.map