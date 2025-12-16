import { apiClient } from "@/lib/api-client";
import type { Recipe } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getFridgeBasedRecipesQueryOptions() {
  return queryOptions({
    queryKey: ["recipes", "list", "fridge-based"],
    queryFn: () => apiClient.get<Recipe[]>("/recipes/recommended/fridge"),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
