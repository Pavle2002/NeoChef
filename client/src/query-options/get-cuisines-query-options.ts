import { apiClient } from "@/lib/api-client";
import type { Cuisine } from "@common/schemas/cuisine";
import { queryOptions } from "@tanstack/react-query";

export function getCuisinesQueryOptions() {
  return queryOptions({
    queryKey: ["cuisines", "list"],
    queryFn: () => apiClient.get<Cuisine[]>(`/cuisines`),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
