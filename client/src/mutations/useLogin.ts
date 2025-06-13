import { apiClient } from "@/lib/api-client";
import type { LoginInput } from "@/types/auth-types";
import type { User } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginInput) =>
      apiClient.post<User>("/auth/login", credentials),
    onSuccess: async (user) => {
      queryClient.setQueryData(["currentUser"], user);
      await router.invalidate();
    },
  });
}
