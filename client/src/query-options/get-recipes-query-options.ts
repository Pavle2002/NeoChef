import { apiClient } from "@/lib/api-client";
import type { Recipe } from "@common/schemas/recipe";
import { queryOptions } from "@tanstack/react-query";

export function getRecipesQueryOptions(offset = 0, limit = 20) {
  return queryOptions({
    queryKey: ["recipes", "list", { offset, limit }],
    queryFn: () =>
      apiClient.get<{ recipes: Recipe[]; totalCount: number }>(
        `/recipes?offset=${offset}&limit=${limit}`
      ),
  });
}
