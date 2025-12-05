import type { Recipe } from "@common/schemas/recipe";
import { RecipeCard } from "./recipe-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";
import { UtensilsCrossed } from "lucide-react";

type RecipeListProps = {
  recipes: Recipe[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export function RecipeList({
  recipes,
  emptyTitle,
  emptyDescription,
}: RecipeListProps) {
  return (
    <div className="flex flex-wrap gap-7 justify-center items-center 2xl:gap-8">
      {recipes.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="shadow-sm">
              <UtensilsCrossed />
            </EmptyMedia>
            <EmptyTitle className="text-xl">
              {emptyTitle || "No recipes found"}
            </EmptyTitle>
            <EmptyDescription className="text-base text-muted-foreground">
              {emptyDescription ||
                "We couldn't find any dishes matching your criteria. Try adjusting your filters."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        recipes.map((recipe: Recipe) => (
          <RecipeCard key={recipe.id} {...recipe} />
        ))
      )}
    </div>
  );
}
