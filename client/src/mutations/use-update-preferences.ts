import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { getCurrentUserPreferencesQueryOptions } from "@/query-options/get-current-user-preferences-query-options";
import { getTopPicksRecipesQueryOptions } from "@/query-options/get-top-picks-recipes-query-options";
import type { Preferences } from "@neochef/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPreferences: Preferences) =>
      apiClient.put<Preferences>("/users/me/preferences", newPreferences),

    onSuccess: async (preferences) => {
      queryClient.setQueryData(
        getCurrentUserPreferencesQueryOptions().queryKey,
        preferences
      );

      toast.success("Preferences updated successfully 🎉", {
        description: getFormatedDate() + " 📆",
      });

      queryClient.invalidateQueries({
        queryKey: getTopPicksRecipesQueryOptions().queryKey,
      });
    },
  });
}
