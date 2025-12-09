import { apiClient } from "@/lib/api-client";
import type { Recipe } from "@common/schemas/recipe";
import { queryOptions } from "@tanstack/react-query";

export function getFridgeBasedRecipesQueryOptions() {
  return queryOptions({
    queryKey: ["recipes", "list", "fridge-based"],
    queryFn: () => apiClient.get<Recipe[]>("/recipes/recommended/fridge"),
  });
}
