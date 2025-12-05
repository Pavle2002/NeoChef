import { apiClient } from "@/lib/api-client";
import type { Recipe } from "@common/schemas/recipe";
import { queryOptions } from "@tanstack/react-query";

export function getCurrentUserSavedRecipesQueryOptions() {
  return queryOptions({
    queryKey: ["recipes", "list", "saved", "me"],
    queryFn: () => apiClient.get<Recipe[]>("/users/me/saved-recipes"),
  });
}
