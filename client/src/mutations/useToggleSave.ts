import { apiClient } from "@/lib/api-client";
import { getCurrentUserSavedRecipesQueryOptions } from "@/query-options/get-current-user-saved-recipes-query-options";
import { getRecipeQueryOptions } from "@/query-options/get-recipe-query-options";
import { getTrendingRecipesQueryOptions } from "@/query-options/get-trending-recipes-query-options";
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
      const recipeQueryKey = getRecipeQueryOptions(recipeId).queryKey;

      await queryClient.cancelQueries({ queryKey: recipeQueryKey });

      const previousRecipe = queryClient.getQueryData(recipeQueryKey);
      queryClient.setQueryData(recipeQueryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          recipe: {
            ...old.recipe,
            isSaved: !isSaved,
          },
        };
      });

      const savedRecipesQueryKey =
        getCurrentUserSavedRecipesQueryOptions().queryKey;

      await queryClient.cancelQueries({ queryKey: savedRecipesQueryKey });

      const previousSavedRecipes =
        queryClient.getQueryData(savedRecipesQueryKey);
      queryClient.setQueryData(
        savedRecipesQueryKey,
        (old: any[] | undefined) => {
          if (!old) return old;
          if (isSaved) return old.filter((recipe) => recipe.id !== recipeId);
          else return old;
        }
      );

      return {
        previousRecipe,
        recipeQueryKey,
        previousSavedRecipes,
        savedRecipesQueryKey,
      };
    },

    onError: (_err, _variables, context) => {
      if (context) {
        queryClient.setQueryData(
          context.recipeQueryKey,
          context.previousRecipe
        );
        queryClient.setQueryData(
          context.savedRecipesQueryKey,
          context.previousSavedRecipes
        );
      }
    },

    onSettled: (_data, _error, _variables, context) => {
      if (context) {
        queryClient.invalidateQueries({ queryKey: context.recipeQueryKey });
        queryClient.invalidateQueries({
          queryKey: context.savedRecipesQueryKey,
        });
      }
      queryClient.invalidateQueries({
        queryKey: getTrendingRecipesQueryOptions().queryKey,
      });
    },
  });
}
