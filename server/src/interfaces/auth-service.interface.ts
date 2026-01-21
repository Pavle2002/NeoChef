import type { UserData, SafeUser } from "@neochef/common";

export interface IAuthService {
  authenticateUser(
    username: string,
    password: string,
  ): Promise<SafeUser | null>;
  registerUser(userData: UserData): Promise<SafeUser>;
}
