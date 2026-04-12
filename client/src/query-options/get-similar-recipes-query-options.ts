import { apiClient } from "@/lib/api-client";
import type { Recipe } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getSimilarRecipesQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["recipes", "list", "similar", { id }],
    queryFn: () => apiClient.get<Recipe[]>(`/recipes/${id}/similar`),
  });
}
