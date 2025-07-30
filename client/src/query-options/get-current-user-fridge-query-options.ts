import { apiClient } from "@/lib/api-client";
import type { Ingredient } from "@common/schemas/ingredient";
import { queryOptions } from "@tanstack/react-query";

export function getCurrentUserFridgeQueryOptions() {
  return queryOptions({
    queryKey: ["fridge", "me"],
    queryFn: () => apiClient.get<Ingredient[]>("/users/me/fridge"),
  });
}
