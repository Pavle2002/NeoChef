import type { RegisterInput } from "@app-types/auth-inputs.js";
import type { User } from "@models/user.js";

export interface IAuthService {
  getUserById(id: string): Promise<User | null>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  registerUser(userData: RegisterInput): Promise<User>;
}
