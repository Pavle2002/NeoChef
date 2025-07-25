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

export const userSchemas = {
  getByIdSchema,
};
