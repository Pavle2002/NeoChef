import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useStartTransformJob() {
  return useMutation({
    mutationFn: async (page: number) =>
      apiClient.post<string>("/jobs/transform", { page }),

    onSuccess: () => {
      toast.success("Transform job started! 🎉", {
        description: getFormatedDate() + " 📆",
      });
    },
  });
}
