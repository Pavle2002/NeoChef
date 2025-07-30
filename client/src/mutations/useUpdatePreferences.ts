import { apiClient } from "@/lib/api-client";
import type { Preferences } from "@common/schemas/preferences";
import { useMutation } from "@tanstack/react-query";

export function useUpdatePreferences() {
  return useMutation({
    mutationFn: (newPreferences: Preferences) =>
      apiClient.put("/users/me/preferences", newPreferences),
  });
}
