import { apiClient } from "@/lib/api-client";
import type { Recipe } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getTrendingRecipesQueryOptions() {
  return queryOptions({
    queryKey: ["recipes", "list", "trending"],
    queryFn: () => apiClient.get<Recipe[]>("/recipes/trending"),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
