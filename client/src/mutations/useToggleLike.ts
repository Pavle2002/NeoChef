import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { getRecipeQueryOptions } from "@/query-options/get-recipe-query-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      const queryKey = getRecipeQueryOptions(recipeId).queryKey;

      await queryClient.cancelQueries({ queryKey });

      const previousRecipe = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
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
      return { previousRecipe, queryKey };
    },

    onError: (_err, _variables, context) => {
      if (context) {
        queryClient.setQueryData(context.queryKey, context.previousRecipe);
      }
      toast.error("Oops! Something went wrong", {
        description: getFormatedDate() + " 📆",
      });
    },

    onSettled: (_data, _error, _variables, context) => {
      if (context) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
      queryClient.invalidateQueries({ queryKey: ["recipes", "list"] });
    },
  });
}
