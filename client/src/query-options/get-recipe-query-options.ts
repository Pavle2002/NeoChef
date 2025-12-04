import { apiClient } from "@/lib/api-client";
import type { ExtendedRecipe } from "@common/schemas/recipe";
import { queryOptions } from "@tanstack/react-query";

export function getRecipeQueryOptions(recipeId: string) {
  return queryOptions({
    queryKey: ["recipes", { recipeId }],
    queryFn: () => apiClient.get<ExtendedRecipe>(`/recipes/${recipeId}`),
  });
}
