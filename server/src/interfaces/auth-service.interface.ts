import type { RegisterInput, SafeUser } from "@app-types/auth-types.js";

export interface IAuthService {
  getUserById(id: string): Promise<SafeUser | null>;
  authenticateUser(
    username: string,
    password: string
  ): Promise<SafeUser | null>;
  registerUser(userData: RegisterInput): Promise<SafeUser>;
}
