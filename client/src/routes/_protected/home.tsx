import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { getFridgeBasedRecipesQueryOptions } from "@/query-options/get-fridge-based-recipes-query-options";
import { getSimilarToLastLikedRecipesQueryOptions } from "@/query-options/get-similar-to-last-liked-recipes-query-options";
import { getTopPicksRecipesQueryOptions } from "@/query-options/get-top-picks-recipes-query-options";
import type { Recipe } from "@common/schemas/recipe";
import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/home")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getTopPicksRecipesQueryOptions());
    queryClient.ensureQueryData(getFridgeBasedRecipesQueryOptions());
    queryClient.ensureQueryData(getSimilarToLastLikedRecipesQueryOptions());
  },

  staticData: { title: "Home" },
});

function RouteComponent() {
  const [
    { data: topPicks },
    { data: fridgeBased },
    { data: similarToLastLiked },
  ] = useSuspenseQueries({
    queries: [
      getTopPicksRecipesQueryOptions(),
      getFridgeBasedRecipesQueryOptions(),
      getSimilarToLastLikedRecipesQueryOptions(),
    ],
  });

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
      <RecipeCarousel recipes={topPicks} />
      <div className="space-y-1 mt-10">
        <h2 className="text-primary text-4xl font-bold">
          Based on Your Fridge 🧊
        </h2>
        <p className="text-lg text-muted-foreground">
          Cook something delicious with what you have on hand.
        </p>
      </div>
      <RecipeCarousel recipes={fridgeBased} />
      <div className="space-y-1 mt-10">
        <h2 className="text-primary text-4xl font-bold">
          Similar to Your Last Liked Recipe ❤️
        </h2>
        <p className="text-lg text-muted-foreground">
          Explore recipes similar to <i>"{similarToLastLiked.basedOn}"</i>.
        </p>
      </div>
      <RecipeCarousel recipes={similarToLastLiked.recipes} />
    </div>
  );
}

function RecipeCarousel({ recipes }: { recipes: Recipe[] }) {
  console.log(recipes);
  return (
    <Carousel
      className="w-[95%] max-w-6xl"
      opts={{ align: "start", loop: true }}
    >
      <CarouselContent className="-ml-4 mr-3">
        {recipes.map((recipe) => (
          <CarouselItem
            key={recipe.id}
            className="basis-1/3 lg:basis-1/4 2xl:basis-1/5 pl-4 py-5"
          >
            <Link
              to="/recipes/$recipeId"
              params={{ recipeId: recipe.id }}
              className="group relative block overflow-hidden rounded-xl shadow-lg "
            >
              <div className="aspect-4/3 w-full overflow-hidden bg-muted">
                <img
                  src={`https://img.spoonacular.com/recipes/${recipe.sourceId}-480x360.${recipe.imageType}`}
                  alt={recipe.title}
                  className="h-full w-full object-cover object-center scale-120 transition-transform duration-250 group-hover:scale-125"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />

              <div className="absolute bottom-0 w-full p-4">
                <h3 className="line-clamp-2 text-sm xl:text-base font-medium leading-tight text-background">
                  {recipe.title}
                </h3>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
}
