import { apiClient } from "@/lib/api-client";
import { getRecipeQueryOptions } from "@/query-options/get-recipe-query-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ToggleSaveParams = {
  recipeId: string;
  isSaved: boolean;
};

export function useToggleSave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipeId, isSaved }: ToggleSaveParams) => {
      if (isSaved) return apiClient.delete<void>(`/recipes/${recipeId}/save`);
      else return apiClient.post<void>(`/recipes/${recipeId}/save`);
    },

    onMutate: async ({ recipeId, isSaved }) => {
      const queryKey = getRecipeQueryOptions(recipeId).queryKey;

      await queryClient.cancelQueries({ queryKey });

      const previousRecipe = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          recipe: {
            ...old.recipe,
            isSaved: !isSaved,
          },
        };
      });
      return { previousRecipe, queryKey };
    },

    onError: (_err, _variables, context) => {
      if (context) {
        queryClient.setQueryData(context.queryKey, context.previousRecipe);
      }
    },

    onSettled: (_data, _error, _variables, context) => {
      if (context) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
}
