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
import {
  RecipeFiltersSchema,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  SORT_BY_OPTIONS,
  SORT_ORDER_OPTIONS,
  type RecipeFilters,
  type RecipeSortOptions,
} from "@common/schemas/recipe";
import { SortOptionsPopover } from "@/components/ui/sort-popover";
import { Suspense } from "react";

const RecipeSearchSchema = RecipeFiltersSchema.extend({
  page: fallback(z.number().int().positive(), 1).default(1),
  size: fallback(z.number().int().positive(), DEFAULT_PAGE_SIZE).default(
    DEFAULT_PAGE_SIZE
  ),
  sortBy: fallback(z.enum(SORT_BY_OPTIONS), DEFAULT_SORT_BY).default(
    DEFAULT_SORT_BY
  ),
  sortOrder: fallback(z.enum(SORT_ORDER_OPTIONS), DEFAULT_SORT_ORDER).default(
    DEFAULT_SORT_ORDER
  ),
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
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
  }),
  loader: async ({ context: { queryClient }, deps }) => {
    const offset = (deps.page - 1) * deps.size;
    const filters = {
      cuisines: deps.cuisines,
      diets: deps.diets,
      dishTypes: deps.dishTypes,
    };
    const sortOptions = {
      sortBy: deps.sortBy,
      sortOrder: deps.sortOrder,
    };
    queryClient.ensureQueryData(
      getRecipesQueryOptions(offset, deps.size, filters, sortOptions)
    );
    queryClient.ensureQueryData(getDietsQueryOptions());
    queryClient.ensureQueryData(getCuisinesQueryOptions());
    queryClient.ensureQueryData(getDishTypesQueryOptions());
  },
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { size, page, cuisines, diets, dishTypes, sortBy, sortOrder } =
    Route.useSearch();

  const filters = { cuisines, diets, dishTypes };
  const sortOptions = { sortBy, sortOrder };

  function handleApplyFilters(newFilters: RecipeFilters) {
    navigate({
      search: (prev) => ({
        ...prev,
        ...newFilters,
        page: 1,
      }),
    });
  }

  function handleSortChange(newSortOptions: RecipeSortOptions) {
    navigate({
      search: (prev) => ({
        ...prev,
        ...newSortOptions,
      }),
    });
  }

  return (
    <>
      <div className="mb-5 flex gap-4">
        <FiltersPopover defaultValues={filters} onApply={handleApplyFilters} />
        <SortOptionsPopover
          value={sortOptions}
          onValueChange={handleSortChange}
        />
      </div>
      <Suspense fallback={<RecipeListSkeleton length={size} />}>
        <RecipesContainer
          page={page}
          size={size}
          filters={filters}
          sortOptions={sortOptions}
        />
      </Suspense>
    </>
  );
}

type RecipesContainerProps = {
  page: number;
  size: number;
  filters: RecipeFilters;
  sortOptions: RecipeSortOptions;
};

function RecipesContainer({
  page,
  filters,
  sortOptions,
  size,
}: RecipesContainerProps) {
  const offset = (page - 1) * size;

  const {
    data: { recipes, totalCount },
  } = useSuspenseQuery(
    getRecipesQueryOptions(offset, size, filters, sortOptions)
  );

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
