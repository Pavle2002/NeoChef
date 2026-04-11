import { Button } from "@/components/ui/button";
import { RecipeCarousel } from "@/components/ui/recipe-carousel";
import { RecipeCarouselSkeleton } from "@/components/ui/recipe-carousel-skeleton";
import { getFridgeBasedRecipesQueryOptions } from "@/query-options/get-fridge-based-recipes-query-options";
import { getSimilarToLastLikedRecipesQueryOptions } from "@/query-options/get-similar-to-last-liked-recipes-query-options";
import { getTopPicksRecipesQueryOptions } from "@/query-options/get-top-picks-recipes-query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { UtensilsCrossed } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/_protected/home")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getTopPicksRecipesQueryOptions("basic"));
    queryClient.ensureQueryData(getTopPicksRecipesQueryOptions("advanced"));
    queryClient.ensureQueryData(getFridgeBasedRecipesQueryOptions());
    queryClient.ensureQueryData(
      getSimilarToLastLikedRecipesQueryOptions("basic"),
    );
    queryClient.ensureQueryData(
      getSimilarToLastLikedRecipesQueryOptions("advanced"),
    );
  },

  staticData: { title: "Home" },
});

function RouteComponent() {
  return (
    <div>
      <div className="space-y-1">
        <h2 className="text-primary text-3xl sm:text-4xl font-bold">
          Top Picks For You ✨
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground">
          Discover recipes handpicked just for you.
        </p>
      </div>
      <Suspense fallback={<RecipeCarouselSkeleton />}>
        <TopPicksSection />
      </Suspense>

      <div className="space-y-1 mt-8">
        <h2 className="text-primary text-3xl sm:text-4xl font-bold">
          Similar to Last Liked ❤️
        </h2>
      </div>
      <Suspense fallback={<SimilarToLastLikedSkeleton />}>
        <SimilarToLastLikedSection />
      </Suspense>

      <div className="space-y-1 mt-8">
        <h2 className="text-primary text-3xl sm:text-4xl font-bold">
          Based on Your Fridge 🧊
        </h2>
      </div>
      <Suspense fallback={<RecipeCarouselSkeleton />}>
        <FridgeBasedSection />
      </Suspense>
    </div>
  );
}

function TopPicksSection() {
  const { data: basic } = useSuspenseQuery(
    getTopPicksRecipesQueryOptions("basic"),
  );
  const { data: advanced } = useSuspenseQuery(
    getTopPicksRecipesQueryOptions("advanced"),
  );
  return (
    <>
      <RecipeCarousel recipes={basic} />
      <RecipeCarousel recipes={advanced} />
    </>
  );
}

function FridgeBasedSection() {
  const { data } = useSuspenseQuery(getFridgeBasedRecipesQueryOptions());
  return data.length > 0 ? (
    <>
      <p className="text-base sm:text-lg text-muted-foreground">
        Cook something delicious with what you have on hand.
      </p>
      <RecipeCarousel recipes={data} />
    </>
  ) : (
    <div className="flex flex-col sm:w-[95%] max-w-6xl items-center justify-center space-y-1 bg-accent/30 rounded-xl px-8 py-4 mt-6 border border-accent shadow-md">
      <div className="bg-accent p-2.5 shadow-sm rounded-lg mb-3">
        <UtensilsCrossed size={25} />
      </div>
      <p className="text-xl font-semibold text-secondary-foreground text-center">
        No recipes found with your fridge ingredients
      </p>
      <p className="text-base text-muted-foreground mb-4 text-center">
        Try adding more ingredients to your fridge to get better recipe matches!
      </p>
      <Button asChild className="px-6">
        <Link to="/fridge">Go to Fridge</Link>
      </Button>
    </div>
  );
}

function SimilarToLastLikedSection() {
  const { data: basic } = useSuspenseQuery(
    getSimilarToLastLikedRecipesQueryOptions("basic"),
  );
  const { data: advanced } = useSuspenseQuery(
    getSimilarToLastLikedRecipesQueryOptions("advanced"),
  );

  return basic != null && advanced != null ? (
    <>
      <p className="text-base sm:text-lg text-muted-foreground">
        Explore recipes similar to <i>"{basic.basedOn}"</i>.
      </p>
      <RecipeCarousel recipes={basic.recipes} />
      <RecipeCarousel recipes={advanced.recipes} />
    </>
  ) : (
    <div className="flex flex-col sm:w-[95%] max-w-6xl items-center justify-center space-y-1 bg-accent/30 rounded-xl px-8 py-4 mt-6 border border-accent shadow-md">
      <div className="bg-accent p-2.5 shadow-sm rounded-lg  mb-3">
        <UtensilsCrossed size={25} />
      </div>
      <p className="text-xl font-semibold text-secondary-foreground text-center">
        No similar recipes found yet
      </p>
      <p className="text-base text-muted-foreground mb-4 text-center">
        Like some recipes to get personalized recommendations!
      </p>
      <Button asChild className="px-6">
        <Link to="/search">Go to Search</Link>
      </Button>
    </div>
  );
}

function SimilarToLastLikedSkeleton() {
  return (
    <>
      <p className="text-lg text-muted-foreground">
        Explore recipes similar to ......
      </p>
      <RecipeCarouselSkeleton />
    </>
  );
}
