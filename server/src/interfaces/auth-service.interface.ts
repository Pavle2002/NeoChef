import type { UserData, SafeUser } from "@common/schemas/user.js";

export interface IAuthService {
  authenticateUser(
    username: string,
    password: string
  ): Promise<SafeUser | null>;
  registerUser(userData: UserData): Promise<SafeUser>;
}
