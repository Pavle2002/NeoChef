import { apiClient } from "@/lib/api-client";
import type { MatchResult } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

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
