import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useStartFastRPJob() {
  return useMutation({
    mutationFn: async () => apiClient.post<string>("/jobs/fastrp"),

    onSuccess: () => {
      toast.success("FastRP job started! 🎉", {
        description: getFormatedDate() + " 📆",
      });
    },
  });
}
