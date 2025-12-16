import { apiClient } from "@/lib/api-client";
import type { Recipe } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getSimilarToLastLikedRecipesQueryOptions() {
  return queryOptions({
    queryKey: ["recipes", "list", "similar"],
    queryFn: () =>
      apiClient.get<{ basedOn: String; recipes: Recipe[] } | null>(
        "/recipes/recommended/similar"
      ),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
