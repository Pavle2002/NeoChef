import { apiClient } from "@/lib/api-client";
import type { Recipe, RecipeFilters } from "@common/schemas/recipe";
import { queryOptions } from "@tanstack/react-query";

export function getRecipesQueryOptions(
  offset = 0,
  limit = 20,
  filters: RecipeFilters = {}
) {
  return queryOptions({
    queryKey: ["recipes", "list", { offset, limit }, filters],
    queryFn: () => {
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
      });

      if (filters.cuisines && filters.cuisines.length > 0) {
        filters.cuisines.forEach((cuisine) =>
          params.append("cuisines", cuisine)
        );
      }
      if (filters.diets && filters.diets.length > 0) {
        filters.diets.forEach((diet) => params.append("diets", diet));
      }
      if (filters.dishTypes && filters.dishTypes.length > 0) {
        filters.dishTypes.forEach((dishType) =>
          params.append("dishTypes", dishType)
        );
      }

      return apiClient.get<{ recipes: Recipe[]; totalCount: number }>(
        `/recipes?${params.toString()}`
      );
    },
  });
}
