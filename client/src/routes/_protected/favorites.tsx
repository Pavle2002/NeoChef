import { RecipeList } from "@/components/ui/recipe-list";
import { RecipeListSkeleton } from "@/components/ui/recipe-list-skeleton";
import { getCurrentUserSavedRecipesQueryOptions } from "@/query-options/get-current-user-saved-recipes-query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/favorites")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getCurrentUserSavedRecipesQueryOptions());
  },
  pendingComponent: PendingComponent,
  staticData: { title: "Favorites" },
});

const LIST_LENGTH = 50;

function RouteComponent() {
  const { data: recipes } = useSuspenseQuery(
    getCurrentUserSavedRecipesQueryOptions()
  );

  return (
    <RecipeList
      recipes={recipes}
      emptyTitle="No saved recipes yet"
      emptyDescription="You haven't saved any recipes. Start exploring and save your favorites!"
    />
  );
}

function PendingComponent() {
  return <RecipeListSkeleton length={LIST_LENGTH} />;
}
