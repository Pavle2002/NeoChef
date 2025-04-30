import { apiClient } from "@/utils/api-client";
import { LoginInput, RegisterInput } from "@/types/auth-inputs";
import { User } from "@/types/user";

export async function getCurrentUser(): Promise<User> {
  return await apiClient.get<User>("/auth/me");
}

export async function register(data: RegisterInput): Promise<User> {
  return await apiClient.post<User>("/auth/register", data);
}

export async function login(data: LoginInput): Promise<User> {
  return await apiClient.post<User>("/auth/login", data);
}

export async function logout(): Promise<void> {
  await apiClient.get<User>("/auth/logout");
}
