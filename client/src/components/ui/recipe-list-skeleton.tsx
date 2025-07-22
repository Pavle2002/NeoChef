import { RecipeCardSkeleton } from "./recipe-card-skeleton";

export function RecipeListSkeleton({ length }: { length: number }) {
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {Array.from({ length }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  );
}
