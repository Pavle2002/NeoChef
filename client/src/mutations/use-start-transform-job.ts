import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

export function useStartTransformJob() {
  return useMutation({
    mutationFn: async (page: number) =>
      apiClient.post<string>("/jobs/transform", { page }),
  });
}
