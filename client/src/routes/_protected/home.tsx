import { getRecipesQueryOptions } from "@/query-options/get-recipes-query-options";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Pagination } from "@/components/ui/pagination";
import { z } from "zod";
import { RecipeListSkeleton } from "@/components/ui/recipe-list-skeleton";
import { RecipeList } from "@/components/ui/recipe-list";
import { getDietsQueryOptions } from "@/query-options/get-diets-query-options";
import { getCuisinesQueryOptions } from "@/query-options/get-cuisines-query-options";
import { getDishTypesQueryOptions } from "@/query-options/get-dish-types-query-options";
import { FiltersPopover } from "@/components/ui/filters-popover";
import { RecipeFiltersSchema } from "@common/schemas/recipe";

const PAGE_SIZE = 21;

const RecipeSearchSchema = RecipeFiltersSchema.extend({
  page: fallback(z.number().int().positive(), 1).default(1),
  size: fallback(z.number().int().positive(), PAGE_SIZE).default(PAGE_SIZE),
});

export const Route = createFileRoute("/_protected/home")({
  component: RouteComponent,
  validateSearch: zodValidator(RecipeSearchSchema),
  loaderDeps: ({ search }) => ({
    page: search.page,
    size: search.size,
    cuisines: search.cuisines,
    diets: search.diets,
    dishTypes: search.dishTypes,
  }),
  loader: async ({ context: { queryClient }, deps }) => {
    const offset = (deps.page - 1) * PAGE_SIZE;
    queryClient.ensureQueryData(
      getRecipesQueryOptions(offset, deps.size, {
        cuisines: deps.cuisines,
        diets: deps.diets,
        dishTypes: deps.dishTypes,
      })
    );
    queryClient.ensureQueryData(getDietsQueryOptions());
    queryClient.ensureQueryData(getCuisinesQueryOptions());
    queryClient.ensureQueryData(getDishTypesQueryOptions());
  },
  pendingComponent: PendingComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, cuisines, diets, dishTypes } = Route.useSearch();
  const offset = (page - 1) * size;
  const filters = { cuisines, diets, dishTypes };

  const {
    data: { recipes, totalCount },
  } = useSuspenseQuery(getRecipesQueryOptions(offset, size, filters));

  const totalPageCount = Math.ceil(totalCount / size);

  return (
    <>
      <FiltersPopover
        defaultValues={filters}
        onApply={(filters) => {
          navigate({ search: filters });
        }}
      />
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
  const { size, cuisines, diets, dishTypes, page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const filters = { cuisines, diets, dishTypes };

  return (
    <>
      <FiltersPopover
        defaultValues={filters}
        onApply={(filters) => {
          navigate({ search: filters });
        }}
      />
      <RecipeListSkeleton length={size} />
      <Pagination routePath={Route.fullPath} page={page} totalPageCount={1} />
    </>
  );
}
