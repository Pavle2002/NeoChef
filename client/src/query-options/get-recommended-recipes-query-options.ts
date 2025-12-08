import { apiClient } from "@/lib/api-client";
import type { Recipe } from "@common/schemas/recipe";
import { queryOptions } from "@tanstack/react-query";

export function getRecommendedRecipesQueryOptions() {
  return queryOptions({
    queryKey: ["recipes", "list", "recommended"],
    queryFn: () => apiClient.get<Recipe[]>("/recipes/recommended"),
  });
}
