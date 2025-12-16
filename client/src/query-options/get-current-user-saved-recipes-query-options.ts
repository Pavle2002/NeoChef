import { apiClient } from "@/lib/api-client";
import type { Recipe } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getCurrentUserSavedRecipesQueryOptions() {
  return queryOptions({
    queryKey: ["recipes", "list", "saved", "me"],
    queryFn: () => apiClient.get<Recipe[]>("/users/me/saved-recipes"),
  });
}
