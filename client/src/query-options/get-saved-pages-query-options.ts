import { apiClient } from "@/lib/api-client";
import { queryOptions } from "@tanstack/react-query";

export function getSavedPagesQueryOptions() {
  return queryOptions({
    queryKey: ["pages"],
    queryFn: () => apiClient.get<number[]>("/jobs/pages"),
  });
}
