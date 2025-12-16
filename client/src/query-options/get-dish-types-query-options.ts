import { apiClient } from "@/lib/api-client";
import type { DishType } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getDishTypesQueryOptions() {
  return queryOptions({
    queryKey: ["dish-types", "list"],
    queryFn: () => apiClient.get<DishType[]>(`/dish-types`),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
