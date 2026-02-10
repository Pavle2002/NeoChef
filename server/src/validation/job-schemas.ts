import { FetchJobSchema } from "@neochef/common";
import z from "zod";

const startFetchJobSchema = z.object({
  body: FetchJobSchema,
});

export const jobSchemas = { startFetchJobSchema };
