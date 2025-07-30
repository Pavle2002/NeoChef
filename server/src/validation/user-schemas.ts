import { IngredientSchema } from "@common/schemas/ingredient.js";
import { PreferencesSchema } from "@common/schemas/preferences.js";
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
