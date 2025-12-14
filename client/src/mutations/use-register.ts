import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import type { UserData } from "@common/schemas/user";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: UserData) =>
      apiClient.post("/auth/register", credentials),

    onSuccess: () => {
      toast.success("Your account has been created successfully! 🎉", {
        description: getFormatedDate() + " 📆",
      });

      navigate({ to: "/login" });
    },
  });
}
