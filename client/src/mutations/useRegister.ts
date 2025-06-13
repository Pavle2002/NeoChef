import { apiClient } from "@/lib/api-client";
import type { RegisterInput } from "@/types/auth-types";
import { useMutation } from "@tanstack/react-query";

export function useRegister() {
  return useMutation({
    mutationFn: (credentials: RegisterInput) =>
      apiClient.post("/auth/register", credentials),
  });
}
