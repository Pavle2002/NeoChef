import { apiClient } from "@/lib/api-client";
import type { CanonicalIngredient } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

type MatchResult = {
  match: CanonicalIngredient;
  confidence: number;
};

export function getSimilarIngredientsQueryOptions(id: string) {
  const limit = 10;
  return queryOptions({
    queryKey: ["ingredients", "similar", { id }],
    queryFn: () =>
      apiClient.get<MatchResult[]>(
        `/ingredients/${id}/similar?limit=${limit.toString()}`,
      ),
  });
}
