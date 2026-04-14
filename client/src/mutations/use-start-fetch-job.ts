import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useStartFetchJob() {
  return useMutation({
    mutationFn: (page: number) =>
      apiClient.post<number>("/jobs/fetch", { page }),

    onSuccess: () => {
      toast.success("Fetch job started! 🎉", {
        description: getFormatedDate() + " 📆",
      });
    },
  });
}
