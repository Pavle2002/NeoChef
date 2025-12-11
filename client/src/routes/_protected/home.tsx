import { RecipeCarousel } from "@/components/ui/recipe-carousel";
import { RecipeCarouselSkeleton } from "@/components/ui/recipe-carousel-skeleton";
import { getFridgeBasedRecipesQueryOptions } from "@/query-options/get-fridge-based-recipes-query-options";
import { getSimilarToLastLikedRecipesQueryOptions } from "@/query-options/get-similar-to-last-liked-recipes-query-options";
import { getTopPicksRecipesQueryOptions } from "@/query-options/get-top-picks-recipes-query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

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
  return (
    <div>
      <div className="space-y-1">
        <h2 className="text-primary text-4xl font-bold">
          Top Picks For You ✨
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover recipes handpicked just for you.
        </p>
      </div>
      <Suspense fallback={<RecipeCarouselSkeleton />}>
        <TopPicksSection />
      </Suspense>

      <div className="space-y-1 mt-8">
        <h2 className="text-primary text-4xl font-bold">
          Similar to Last Liked ❤️
        </h2>
      </div>
      <Suspense fallback={<SimilarToLastLikedSkeleton />}>
        <SimilarToLastLikedSection />
      </Suspense>

      <div className="space-y-1 mt-8">
        <h2 className="text-primary text-4xl font-bold">
          Based on Your Fridge 🧊
        </h2>
        <p className="text-lg text-muted-foreground">
          Cook something delicious with what you have on hand.
        </p>
      </div>
      <Suspense fallback={<RecipeCarouselSkeleton />}>
        <FridgeBasedSection />
      </Suspense>
    </div>
  );
}

function TopPicksSection() {
  const { data } = useSuspenseQuery(getTopPicksRecipesQueryOptions());
  return <RecipeCarousel recipes={data} />;
}

function FridgeBasedSection() {
  const { data } = useSuspenseQuery(getFridgeBasedRecipesQueryOptions());
  return <RecipeCarousel recipes={data} />;
}

function SimilarToLastLikedSection() {
  const { data } = useSuspenseQuery(getSimilarToLastLikedRecipesQueryOptions());
  return (
    <>
      <p className="text-lg text-muted-foreground">
        Explore recipes similar to <i>"{data.basedOn}"</i>.
      </p>
      <RecipeCarousel recipes={data.recipes} />
    </>
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
