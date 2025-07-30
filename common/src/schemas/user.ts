import { z } from "zod";

const usernameSchema = z
  .string({
    required_error: "Username is required",
    invalid_type_error: "Username must be a string",
  })
  .trim()
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  )
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username must be at most 20 characters long");

const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
  .min(8, "Password must be at least 8 characters long")
  .max(32, "Password must be at most 32 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character"
  );

const emailSchema = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
  .email("Invalid email");

export const UserSchema = z
  .object({
    id: z.string().uuid(),
    username: usernameSchema,
    password: passwordSchema,
    email: emailSchema,
    createdAt: z.date(),
  })
  .strict("Invalid format");

export const SafeUserSchema = UserSchema.omit({
  password: true,
});

export const UserDataSchema = UserSchema.omit({
  id: true,
  createdAt: true,
});

export const UserCredentialsSchema = UserSchema.omit({
  username: true,
  id: true,
  createdAt: true,
});

export type User = z.infer<typeof UserSchema>;
export type SafeUser = z.infer<typeof SafeUserSchema>;
export type UserData = z.infer<typeof UserDataSchema>;
export type UserCredentials = z.infer<typeof UserCredentialsSchema>;
