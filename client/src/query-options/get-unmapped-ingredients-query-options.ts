import { apiClient } from "@/lib/api-client";
import type { Ingredient } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getUnmappedIngredientsQueryOptions() {
  return queryOptions({
    queryKey: ["ingredients", "list", "unmapped"],
    queryFn: () => apiClient.get<Ingredient[]>(`/ingredients/unmapped`),
  });
}
