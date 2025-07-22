import type { RegisterInput, SafeUser } from "@app-types/auth-types.js";

export interface IAuthService {
  authenticateUser(
    username: string,
    password: string
  ): Promise<SafeUser | null>;
  registerUser(userData: RegisterInput): Promise<SafeUser>;
}
