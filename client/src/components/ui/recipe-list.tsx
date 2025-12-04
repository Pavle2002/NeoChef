import type { Recipe } from "@common/schemas/recipe";
import { RecipeCard } from "./recipe-card";

export function RecipeList({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="flex flex-wrap gap-7 justify-center items-center 2xl:gap-8">
      {recipes.length === 0 ? (
        <p className="w-sm py-36 text-center text-xl">
          No recipes found <br />
          <span className="text-base text-muted-foreground">
            Try adjusting your filters or search criteria.
          </span>
        </p>
      ) : (
        recipes.map((recipe: Recipe) => (
          <RecipeCard key={recipe.id} {...recipe} />
        ))
      )}
    </div>
  );
}
