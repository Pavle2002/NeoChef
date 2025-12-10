import { apiClient } from "@/lib/api-client";
import type { Recipe } from "@common/schemas/recipe";
import { queryOptions } from "@tanstack/react-query";

export function getTopPicksRecipesQueryOptions() {
  return queryOptions({
    queryKey: ["recipes", "list", "top-picks"],
    queryFn: () => apiClient.get<Recipe[]>("/recipes/recommended"),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
