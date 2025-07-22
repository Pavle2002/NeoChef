import type { Recipe } from "@/types/recipe";
import { RecipeCard } from "./recipe-card";

export function RecipeList({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {recipes.map((recipe: Recipe) => (
        <RecipeCard key={recipe.id} {...recipe} />
      ))}
    </div>
  );
}
