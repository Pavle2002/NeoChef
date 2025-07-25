import { apiClient } from "@/lib/api-client";
import type { Preferences } from "@/types/preferences";
import { queryOptions } from "@tanstack/react-query";

export function getCurrentUserPreferencesQueryOptions() {
  return queryOptions({
    queryKey: ["preferences", "me"],
    queryFn: () => apiClient.get<Preferences>("/users/me/preferences"),
  });
}
