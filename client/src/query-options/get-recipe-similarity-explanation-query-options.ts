import { apiClient } from "@/lib/api-client";
import type { SimilarityExplanation } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getRecipeSimilarityExplanationQueryOptions(
  recipe1Id: string,
  recipe2Id: string,
) {
  return queryOptions({
    queryKey: ["recipes", "similar", "explanation", { recipe1Id, recipe2Id }],
    queryFn: () =>
      apiClient.get<SimilarityExplanation>(
        `/recipes/${recipe1Id}/similarity/${recipe2Id}/explanation`,
      ),
  });
}
