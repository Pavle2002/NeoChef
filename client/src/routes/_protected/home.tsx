import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { getRecommendedRecipesQueryOptions } from "@/query-options/get-recommended-recipes-query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/home")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getRecommendedRecipesQueryOptions()),
  staticData: { title: "Home" },
});

function RouteComponent() {
  const { data: topPicks } = useSuspenseQuery(
    getRecommendedRecipesQueryOptions()
  );

  return (
    <div className="">
      <div className="space-y-1">
        <h2 className="text-primary text-4xl font-bold">
          Top Picks For You ✨
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover recipes handpicked just for you.
        </p>
      </div>
      <Carousel
        className="w-11/12 max-w-5xl"
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent className="-ml-4 mr-3">
          {topPicks.map((recipe, index) => (
            <CarouselItem
              key={index}
              className="basis-1/3 lg:basis-1/4 pl-4 py-5"
            >
              <Link
                to="/recipes/$recipeId"
                params={{ recipeId: recipe.id }}
                className="group relative block overflow-hidden rounded-xl shadow-lg "
              >
                <div className="aspect-5/4 w-full overflow-hidden bg-muted">
                  <img
                    src={`https://img.spoonacular.com/recipes/${recipe.sourceId}-480x360.${recipe.imageType}`}
                    alt={recipe.title}
                    className="h-full w-full object-cover object-center scale-120 transition-transform duration-250 group-hover:scale-125"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />

                <div className="absolute bottom-0 w-full p-4 ">
                  <h3 className="line-clamp-2 text-sm font-medium leading-tight text-background">
                    {recipe.title}
                  </h3>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </div>
  );
}
