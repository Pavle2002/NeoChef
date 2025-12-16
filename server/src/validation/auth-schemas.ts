import { UserCredentialsSchema, UserDataSchema } from "@neochef/common";
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
