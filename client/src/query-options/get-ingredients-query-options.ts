import { apiClient } from "@/lib/api-client";
import type { CanonicalIngredient } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getIngredientsQueryOptions(query: string) {
  return queryOptions({
    queryKey: ["ingredients", "list", { query }],
    queryFn: () =>
      apiClient.get<CanonicalIngredient[]>(`/ingredients?q=${query}`),
  });
}
