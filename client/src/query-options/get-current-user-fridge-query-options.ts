import { apiClient } from "@/lib/api-client";
import type { Ingredient } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getCurrentUserFridgeQueryOptions() {
  return queryOptions({
    queryKey: ["fridge", "me"],
    queryFn: () => apiClient.get<Ingredient[]>("/users/me/fridge"),
  });
}
