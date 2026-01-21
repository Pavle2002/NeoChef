import { apiClient } from "@/lib/api-client";
import { getRecipeQueryOptions } from "@/query-options/get-recipe-query-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ToggleLikeParams = {
  recipeId: string;
  isLiked: boolean;
};

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipeId, isLiked }: ToggleLikeParams) => {
      if (isLiked) return apiClient.delete<void>(`/recipes/${recipeId}/like`);
      else return apiClient.post<void>(`/recipes/${recipeId}/like`);
    },

    onMutate: async ({ recipeId, isLiked }) => {
      const recipeQueryKey = getRecipeQueryOptions(recipeId).queryKey;

      await queryClient.cancelQueries({ queryKey: recipeQueryKey });

      const previousRecipe = queryClient.getQueryData(recipeQueryKey);

      queryClient.setQueryData(recipeQueryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          recipe: {
            ...old.recipe,
            isLiked: !isLiked,
            likeCount: isLiked
              ? old.recipe.likeCount - 1
              : old.recipe.likeCount + 1,
          },
        };
      });

      return {
        previousRecipe,
        recipeQueryKey,
      };
    },

    onError: (_err, _variables, context) => {
      if (context) {
        queryClient.setQueryData(
          context.recipeQueryKey,
          context.previousRecipe,
        );
      }
    },

    onSettled: (_data, _error, _variables, context) => {
      if (context) {
        queryClient.invalidateQueries({ queryKey: context.recipeQueryKey });
      }
      queryClient.invalidateQueries({ queryKey: ["recipes", "list"] });
    },
  });
}
