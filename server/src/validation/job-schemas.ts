import { FetchJobSchema, TransformJobSchema } from "@neochef/common";
import z from "zod";

const startFetchJobSchema = z.object({
  body: FetchJobSchema.pick({ page: true }),
});

const startTransformJobSchema = z.object({
  body: TransformJobSchema.pick({ page: true }),
});

export const jobSchemas = { startFetchJobSchema, startTransformJobSchema };
