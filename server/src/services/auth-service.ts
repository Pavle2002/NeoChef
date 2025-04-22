import bcrypt from "bcrypt";
import type { User } from "@models/user.js";
import type { IAuthService } from "@interfaces/auth-service.interface.js";
import type { IUserRepository } from "@interfaces/user-repository.interface.js";
import type { RegisterInput } from "@app-types/auth-types.js";

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async authenticateUser(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async registerUser(userData: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = { ...userData, password: hashedPassword } as RegisterInput;
    return this.userRepository.create(newUser);
  }
}
