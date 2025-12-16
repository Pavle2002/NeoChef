import { IngredientSchema } from "@neochef/common";
import { PreferencesSchema } from "@neochef/common";
import { z } from "zod";

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

const updatePreferencesSchema = z.object({
  body: PreferencesSchema,
});

const updateFridgeSchema = z.object({
  body: z.array(IngredientSchema),
});

export const userSchemas = {
  getByIdSchema,
  updatePreferencesSchema,
  updateFridgeSchema,
};
