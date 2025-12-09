import { Skeleton } from "./skeleton";

export function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[145px] w-2xs rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-2xs" />
        <Skeleton className="h-7 w-2xs" />
      </div>
    </div>
  );
}
