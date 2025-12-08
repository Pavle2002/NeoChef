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
        <CarouselContent className="mr-3">
          {topPicks.map((recipe, index) => (
            <CarouselItem key={index} className="basis-1/3 lg:basis-1/4 pl-5">
              <Link
                to="/recipes/$recipeId"
                params={{ recipeId: recipe.id }}
                className="p-1"
              >
                <div className="rounded-lg overflow-hidden shadow-md transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg">
                  <img
                    src={`https://img.spoonacular.com/recipes/${recipe.sourceId}-480x360.${recipe.imageType}`}
                    alt={recipe.title}
                    className="aspect-5/4 object-cover"
                  />
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
