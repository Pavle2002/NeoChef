import { apiClient } from "@/lib/api-client";
import type { Recipe } from "@common/schemas/recipe";
import { queryOptions } from "@tanstack/react-query";

export function getTrendingRecipesQueryOptions() {
  return queryOptions({
    queryKey: ["recipes", "list", "trending"],
    queryFn: () => apiClient.get<Recipe[]>("/recipes/trending"),
  });
}
