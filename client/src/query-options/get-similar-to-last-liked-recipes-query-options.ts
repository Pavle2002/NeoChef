import { apiClient } from "@/lib/api-client";
import type { Recipe, RecommendationMode } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getSimilarToLastLikedRecipesQueryOptions(
  mode: RecommendationMode,
) {
  return queryOptions({
    queryKey: ["recipes", "list", "similar", mode],
    queryFn: () =>
      apiClient.get<{ lastLiked: Recipe; recipes: Recipe[] } | null>(
        `/recipes/recommended/similar?mode=${mode}`,
      ),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
