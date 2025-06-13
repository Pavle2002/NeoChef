import type { User } from "@models/user.js";
import type { loginSchema, registerSchema } from "@schemas/auth-schemas.js";
import type { z } from "zod";

export type LoginInput = z.infer<typeof loginSchema.shape.body>;
export type RegisterInput = z.infer<typeof registerSchema.shape.body>;

export type SafeUser = Omit<User, "password">;
