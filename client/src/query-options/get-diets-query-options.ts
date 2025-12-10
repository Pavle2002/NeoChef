import { apiClient } from "@/lib/api-client";
import type { Diet } from "@common/schemas/diet";
import { queryOptions } from "@tanstack/react-query";

export function getDietsQueryOptions() {
  return queryOptions({
    queryKey: ["diets", "list"],
    queryFn: () => apiClient.get<Diet[]>(`/diets`),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
