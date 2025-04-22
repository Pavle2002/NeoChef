import { apiClient } from "@/lib/apiClient";
import { ApiError } from "@/lib/errors";
import { LoginInput, RegisterInput } from "@/types/auth-inputs";
import { User } from "@/types/user";

export async function getCurrentUser(): Promise<User> {
  const user = await apiClient.get<User>("/auth/me");

  if (user === null) throw new ApiError("Failed to get current user");

  return user;
}

export async function register(data: RegisterInput): Promise<User> {
  const user = await apiClient.post<User>("/auth/register", data);

  if (user === null) throw new ApiError("Failed to register");

  return user;
}

export async function login(data: LoginInput): Promise<User> {
  const user = await apiClient.post<User>("/auth/login", data);

  if (user === null) throw new ApiError("Failed to login");

  return user;
}

export async function logout(): Promise<void> {
  await apiClient.get<User>("/auth/logout");
}
