import { getRecipesQueryOptions } from "@/query-options/get-recipes-query-options";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Pagination } from "@/components/ui/pagination";
import { z } from "zod";
import { RecipeListSkeleton } from "@/components/ui/recipe-list-skeleton";
import { RecipeList } from "@/components/ui/recipe-list";

const PAGE_SIZE = 21;

const recipeSearchSchema = z.object({
  page: fallback(z.number().int().positive(), 1).default(1),
  size: fallback(z.number().int().positive(), PAGE_SIZE).default(PAGE_SIZE),
});

export const Route = createFileRoute("/_protected/home")({
  component: RouteComponent,
  validateSearch: zodValidator(recipeSearchSchema),
  loaderDeps: ({ search: { page, size } }) => ({ page, size }),
  loader: async ({ context: { queryClient }, deps: { page, size } }) => {
    const offset = (page - 1) * PAGE_SIZE;
    queryClient.ensureQueryData(getRecipesQueryOptions(offset, size));
  },
  pendingComponent: PendingComponent,
});

function RouteComponent() {
  const { page, size } = Route.useSearch();
  const offset = (page - 1) * size;

  const {
    data: { recipes, totalCount },
  } = useSuspenseQuery(getRecipesQueryOptions(offset, size));

  const totalPageCount = Math.ceil(totalCount / size);

  return (
    <>
      <RecipeList recipes={recipes} />
      <Pagination
        routePath={Route.fullPath}
        page={page}
        totalPageCount={totalPageCount}
      />
    </>
  );
}

function PendingComponent() {
  const { size } = Route.useSearch();

  return <RecipeListSkeleton length={size} />;
}
