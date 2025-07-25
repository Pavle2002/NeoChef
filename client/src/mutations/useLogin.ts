import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { getCurrentUserQueryOptions } from "@/query-options/get-current-user-query-options";
import type { LoginInput } from "@/types/auth-types";
import type { User } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginInput) =>
      apiClient.post<User>("/auth/login", credentials),

    onSuccess: async (user) => {
      queryClient.setQueryData(getCurrentUserQueryOptions().queryKey, user);

      toast.success("Welcome back. You successfully logged in 🎉", {
        description: getFormatedDate() + " 📆",
      });

      navigate({ to: "/home", replace: true });
    },
  });
}
