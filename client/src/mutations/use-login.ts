import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { getCurrentUserQueryOptions } from "@/query-options/get-current-user-query-options";
import type { UserCredentials, SafeUser } from "@neochef/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: UserCredentials) =>
      apiClient.post<SafeUser>("/auth/login", credentials),

    onSuccess: async (user) => {
      queryClient.setQueryData(getCurrentUserQueryOptions().queryKey, user);

      toast.success("You have successfully logged in 🎉", {
        description: getFormatedDate() + " 📆",
      });

      if (user.isAdmin) navigate({ to: "/dashboard", replace: true });
      else navigate({ to: "/home", replace: true });
    },
  });
}
