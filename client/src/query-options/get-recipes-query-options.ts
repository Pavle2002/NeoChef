import { apiClient } from "@/lib/api-client";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  type Recipe,
  type RecipeFilters,
  type RecipeSortOptions,
} from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getRecipesQueryOptions(
  offset = 0,
  limit = DEFAULT_PAGE_SIZE,
  filters: RecipeFilters = {},
  sortOptions: RecipeSortOptions = {
    sortBy: DEFAULT_SORT_BY,
    sortOrder: DEFAULT_SORT_ORDER,
  },
  search?: string
) {
  return queryOptions({
    queryKey: [
      "recipes",
      "list",
      { offset, limit },
      filters,
      sortOptions,
      { search },
    ],
    queryFn: () => {
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
        sortBy: sortOptions.sortBy,
        sortOrder: sortOptions.sortOrder,
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

      if (search && search.length > 0) {
        params.append("search", search);
      }

      return apiClient.get<{ recipes: Recipe[]; totalCount: number }>(
        `/recipes?${params.toString()}`
      );
    },
  });
}
