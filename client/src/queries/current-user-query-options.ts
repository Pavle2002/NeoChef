import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/user";
import { queryOptions } from "@tanstack/react-query";

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: ["currentUser"],
    queryFn: () => apiClient.get<User | null>("/auth/me"),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
