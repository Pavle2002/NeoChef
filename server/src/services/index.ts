import { AuthService } from "@services/auth-service.js";
import { UserRepository } from "@repositories/user-repository.js";

const userRepository = new UserRepository();

export const authService = new AuthService(userRepository);
