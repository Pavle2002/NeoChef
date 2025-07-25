import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { getCurrentUserQueryOptions } from "@/query-options/get-current-user-query-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),

    onSuccess: async () => {
      queryClient.setQueryData(getCurrentUserQueryOptions().queryKey, null);
      await router.invalidate();

      toast.success("You have successfully logged out 🎉", {
        description: getFormatedDate() + " 📆",
      });
    },

    onError: (error) => {
      toast.error("Oops! Logout failed: " + error.message, {
        description: getFormatedDate() + " 📆",
      });
    },
  });
}
