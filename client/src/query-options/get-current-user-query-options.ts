import { apiClient } from "@/lib/api-client";
import type { SafeUser } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getCurrentUserQueryOptions() {
  return queryOptions({
    queryKey: ["users", "me"],
    queryFn: () => apiClient.get<SafeUser | null>("/users/me"),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
