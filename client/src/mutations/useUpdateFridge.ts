import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { getCurrentUserFridgeQueryOptions } from "@/query-options/get-current-user-fridge-query-options";
import type { Ingredient } from "@common/schemas/ingredient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateFridge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newFridge: Ingredient[]) =>
      apiClient.put<Ingredient[]>("/users/me/fridge", newFridge),

    onSuccess: async (fridge) => {
      queryClient.setQueryData(
        getCurrentUserFridgeQueryOptions().queryKey,
        fridge
      );

      toast.success("Fridge updated successfully 🎉", {
        description: getFormatedDate() + " 📆",
      });
    },
  });
}
