import { RecipeCardSkeleton } from "./recipe-card-skeleton";

export function RecipeListSkeleton({ length }: { length: number }) {
  return (
    <div className="flex flex-wrap gap-7 justify-center 2xl:gap-8">
      {Array.from({ length }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  );
}
