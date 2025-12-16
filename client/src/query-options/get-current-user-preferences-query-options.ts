import { apiClient } from "@/lib/api-client";
import type { Preferences } from "@neochef/common";
import { queryOptions } from "@tanstack/react-query";

export function getCurrentUserPreferencesQueryOptions() {
  return queryOptions({
    queryKey: ["preferences", "me"],
    queryFn: () => apiClient.get<Preferences>("/users/me/preferences"),
  });
}
