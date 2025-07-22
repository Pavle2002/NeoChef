import bcrypt from "bcrypt";
import type { User } from "@models/user.js";
import type { IAuthService } from "@interfaces/auth-service.interface.js";
import type { IUserRepository } from "@interfaces/user-repository.interface.js";
import type { RegisterInput, SafeUser } from "@app-types/auth-types.js";

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async authenticateUser(
    email: string,
    password: string
  ): Promise<SafeUser | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async registerUser(userData: RegisterInput): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUserData: RegisterInput = {
      ...userData,
      password: hashedPassword,
    };
    const newUser = await this.userRepository.create(newUserData);

    const { password, ...safeUser } = newUser;
    return safeUser;
  }
}
