import type { User, UserInput } from "@models/user.js";

export interface IAuthService {
  getUserById(id: string): Promise<User | null>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  registerUser(userData: UserInput): Promise<User>;
}
