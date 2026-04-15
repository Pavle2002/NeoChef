import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useStartEmbeddingJob() {
  return useMutation({
    mutationFn: async () => apiClient.post<string>("/jobs/embedding"),

    onSuccess: () => {
      toast.success("Embedding generation job started! 🎉", {
        description: getFormatedDate() + " 📆",
      });
    },
  });
}
