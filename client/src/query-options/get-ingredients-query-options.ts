import { apiClient } from "@/lib/api-client";
import type { Ingredient } from "@/types/ingredient";
import { queryOptions } from "@tanstack/react-query";

export function getIngredientsQueryOptions(query: string) {
  return queryOptions({
    queryKey: ["ingredients", "list", { query }],
    queryFn: () => apiClient.get<Ingredient[]>(`/ingredients?q=${query}`),
  });
}
