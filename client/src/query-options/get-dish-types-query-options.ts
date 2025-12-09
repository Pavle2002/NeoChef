import { apiClient } from "@/lib/api-client";
import type { DishType } from "@common/schemas/dish-type";
import { queryOptions } from "@tanstack/react-query";

export function getDishTypesQueryOptions() {
  return queryOptions({
    queryKey: ["dish-types", "list"],
    queryFn: () => apiClient.get<DishType[]>(`/dish-types`),
  });
}
