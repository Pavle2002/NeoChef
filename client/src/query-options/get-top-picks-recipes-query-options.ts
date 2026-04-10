import { apiClient } from "@/lib/api-client";
import type { Recipe, RecommendationMode } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getTopPicksRecipesQueryOptions(mode: RecommendationMode) {
  return queryOptions({
    queryKey: ["recipes", "list", "top-picks", mode],
    queryFn: () => apiClient.get<Recipe[]>(`/recipes/recommended?mode=${mode}`),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
