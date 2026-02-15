import { FetchJobSchema, TransformJobSchema } from "@neochef/common";
import z from "zod";

const startFetchJobSchema = z.object({
  body: FetchJobSchema.omit({ correlationId: true }),
});

const startTransformJobSchema = z.object({
  body: TransformJobSchema.omit({ correlationId: true }),
});

export const jobSchemas = { startFetchJobSchema, startTransformJobSchema };
