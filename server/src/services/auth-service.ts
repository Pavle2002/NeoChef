import bcrypt from "bcrypt";
import type { User, UserInput } from "@models/index.js";
import type { IAuthService, IUserRepository } from "@interfaces/index.js";

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async authenticateUser(
    username: string,
    password: string
  ): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async registerUser(userData: UserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = { ...userData, password: hashedPassword } as UserInput;
    return this.userRepository.create(newUser);
  }
}
