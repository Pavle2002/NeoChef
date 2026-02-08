import { apiClient } from "@/lib/api-client";
import type { CanonicalIngredient } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getCurrentUserFridgeQueryOptions() {
  return queryOptions({
    queryKey: ["fridge", "me"],
    queryFn: () => apiClient.get<CanonicalIngredient[]>("/users/me/fridge"),
  });
}
