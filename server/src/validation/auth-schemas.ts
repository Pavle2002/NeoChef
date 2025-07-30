import { UserCredentialsSchema, UserDataSchema } from "@common/schemas/user.js";
import { z } from "zod";

const loginSchema = z.object({
  body: UserCredentialsSchema,
});

const registerSchema = z.object({
  body: UserDataSchema,
});

export const authSchemas = {
  loginSchema,
  registerSchema,
};
