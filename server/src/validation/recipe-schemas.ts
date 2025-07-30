import { z } from "zod";

const positiveInt = z
  .preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z
      .number()
      .int({ message: "Limit must be an integer" })
      .positive({ message: "Limit must be a positive integer" })
      .optional()
  )
  .refine((val) => val === undefined || !Number.isNaN(val), {
    message: "Limit must be a number",
  });

const nonNegativeInt = z
  .preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z
      .number()
      .int({ message: "Offset must be an integer" })
      .nonnegative({ message: "Offset must be a non-negative integer" })
      .optional()
  )
  .refine((val) => val === undefined || !Number.isNaN(val), {
    message: "Offset must be a number",
  });

const getAllSchema = z.object({
  query: z.object({
    limit: positiveInt,
    offset: nonNegativeInt,
  }),
});

const getByIdSchema = z.object({
  params: z.object({
    id: z
      .string({
        required_error: "Id is required",
        invalid_type_error: "Id must be a string",
      })
      .uuid({ message: "Id must be a valid UUID" }),
  }),
});

export const recipeSchemas = {
  getAllSchema,
  getByIdSchema,
};
