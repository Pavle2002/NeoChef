import { apiClient } from "@/lib/api-client";
import type { Recipe } from "@common/schemas/recipe";
import { queryOptions } from "@tanstack/react-query";

export function getSimilarToLastLikedRecipesQueryOptions() {
  return queryOptions({
    queryKey: ["recipes", "list", "similar"],
    queryFn: () =>
      apiClient.get<{ basedOn: String; recipes: Recipe[] }>(
        "/recipes/recommended/similar"
      ),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
