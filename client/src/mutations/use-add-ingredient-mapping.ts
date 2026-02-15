import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { getUnmappedIngredientsQueryOptions } from "@/query-options/get-unmapped-ingredients-query-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type AddIngredientMappingParams = {
  ingredientId: string;
  canonicalId: string;
  confidence: number;
};

export function useAddIngredientMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ingredientId,
      canonicalId,
      confidence,
    }: AddIngredientMappingParams) =>
      apiClient.post<null>(`/ingredients/${ingredientId}/mapping`, {
        canonicalId,
        confidence,
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getUnmappedIngredientsQueryOptions().queryKey,
      });
      toast.success("Ingredient mapping added successfully 🎉", {
        description: getFormatedDate() + " 📆",
      });
    },
  });
}
