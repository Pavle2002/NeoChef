import { FetchJobSchema, TransformJobSchema } from "@neochef/common";
import z from "zod";

const startFetchJobSchema = z.object({
  body: FetchJobSchema.omit({ corelationId: true }),
});

const startTransformJobSchema = z.object({
  body: TransformJobSchema.omit({ corelationId: true }),
});

export const jobSchemas = { startFetchJobSchema, startTransformJobSchema };
