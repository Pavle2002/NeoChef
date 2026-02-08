import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { getCurrentUserFridgeQueryOptions } from "@/query-options/get-current-user-fridge-query-options";
import { getFridgeBasedRecipesQueryOptions } from "@/query-options/get-fridge-based-recipes-query-options";
import type { CanonicalIngredient } from "@neochef/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateFridge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newFridge: CanonicalIngredient[]) =>
      apiClient.put<CanonicalIngredient[]>("/users/me/fridge", newFridge),

    onSuccess: async (fridge) => {
      queryClient.setQueryData(
        getCurrentUserFridgeQueryOptions().queryKey,
        fridge,
      );

      toast.success("Fridge updated successfully 🎉", {
        description: getFormatedDate() + " 📆",
      });

      queryClient.invalidateQueries({
        queryKey: getFridgeBasedRecipesQueryOptions().queryKey,
      });
    },
  });
}
