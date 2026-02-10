import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

export function useStartFetchJob() {
  return useMutation({
    mutationFn: (page: number) =>
      apiClient.post<number>("/jobs/fetch", { page }),
  });
}
