import { getRecipeSimilarityExplanationQueryOptions } from "@/query-options/get-recipe-similarity-explanation-query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BadgeGroup } from "./badge-group";
import { Suspense } from "react";
import { Spinner } from "./spinner";

type SimilarityExplanationProps = {
  recipe1Id: string;
  recipe2Id: string;
};

export function SimilarityExplanation({
  recipe1Id,
  recipe2Id,
}: SimilarityExplanationProps) {
  return (
    <Suspense fallback={<SimilarityExplanationSkeleton />}>
      <SimilarityExplanationContent
        recipe1Id={recipe1Id}
        recipe2Id={recipe2Id}
      />
    </Suspense>
  );
}

function SimilarityExplanationContent({
  recipe1Id,
  recipe2Id,
}: SimilarityExplanationProps) {
  const { data: explanation } = useSuspenseQuery(
    getRecipeSimilarityExplanationQueryOptions(recipe1Id, recipe2Id),
  );

  return (
    <div className="max-w-xs space-y-2.5">
      {explanation.sharedIngredients.length > 0 && (
        <div className="text-md text-primary space-y-1">
          <h4 className="ml-1 font-semibold">Shared ingredients: </h4>
          <div className="flex flex-wrap gap-1.5">
            <BadgeGroup items={explanation.sharedIngredients} color="green" />
          </div>
        </div>
      )}
      {explanation.sharedCuisines.length > 0 && (
        <div className="text-md text-primary space-y-1">
          <h4 className="ml-1 font-semibold">Shared cuisines: </h4>
          <div className="flex flex-wrap gap-1.5">
            <BadgeGroup items={explanation.sharedCuisines} color="orange" />
          </div>
        </div>
      )}
      {explanation.sharedDishTypes.length > 0 && (
        <div className="text-md text-primary space-y-1">
          <h4 className="ml-1 font-semibold">Shared dish types: </h4>
          <div className="flex flex-wrap gap-1.5">
            <BadgeGroup items={explanation.sharedDishTypes} color="blue" />
          </div>
        </div>
      )}
    </div>
  );
}

function SimilarityExplanationSkeleton() {
  return (
    <div className="flex justify-center items-center">
      <Spinner />
    </div>
  );
}
