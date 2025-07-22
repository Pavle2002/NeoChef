import { RecipeList } from "@/components/ui/recipe-list";
import { RecipeListSkeleton } from "@/components/ui/recipe-list-skeleton";
import { getTrendingRecipesQueryOptions } from "@/queries/get-trending-recipes-query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/trending")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getTrendingRecipesQueryOptions()),
  pendingComponent: PendingComponent,
});

const LIST_LENGTH = 50;

function RouteComponent() {
  const { data: recipes } = useSuspenseQuery(getTrendingRecipesQueryOptions());
  return <RecipeList recipes={recipes} />;
}

function PendingComponent() {
  return <RecipeListSkeleton length={LIST_LENGTH} />;
}
