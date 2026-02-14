import { apiClient } from "@/lib/api-client";
import type { CanonicalIngredient } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

type MatchResult = {
  match: CanonicalIngredient;
  confidence: number;
};

export function getSimilarIngredientsQueryOptions(id: string, limit: number) {
  return queryOptions({
    queryKey: ["ingredients", "similar", { id, limit }],
    queryFn: () =>
      apiClient.get<MatchResult[]>(
        `/ingredients/similar/${id}?limit=${limit.toString()}`,
      ),
  });
}
