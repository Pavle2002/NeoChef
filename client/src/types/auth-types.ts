import type { loginSchema, registerSchema } from "@/schemas/auth-schemas";
import type { z } from "zod";

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
