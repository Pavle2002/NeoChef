import type { Recipe } from "@/types/recipe";
import { Separator } from "./separator";
import { AlarmClock, Cross, Flame } from "lucide-react";

export function RecipeCard(recipe: Recipe) {
  const calories =
    recipe.caloriesPerServing != null
      ? recipe.caloriesPerServing.toFixed(0)
      : "?";

  const healthScore =
    recipe.healthScore != null ? recipe.healthScore.toFixed(0) : "?";

  return (
    <div className="w-2xs rounded-md overflow-hidden shadow-lg transition-transform duration-150 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
      <img
        className="w-full h-36 object-cover"
        src={`https://img.spoonacular.com/recipes/${recipe.sourceId}-480x360.${recipe.imageType}`}
        alt={recipe.title}
      />

      <div className="py-3 px-4">
        <h3 className="text-base font-medium truncate whitespace-nowrap overflow-hidden">
          {recipe.title}
        </h3>
      </div>

      <Separator />

      <div className="py-2 px-4 flex gap-3 text-xs text-secondary-foreground">
        <p>
          <Flame
            strokeWidth={2.5}
            className="inline mb-1 mr-1 size-4 text-amber-600"
            fill="currentColor"
          />
          {calories} cal
        </p>
        <p>
          <Cross
            strokeWidth={2.5}
            className="inline mb-1 mr-1 size-4 text-emerald-700"
            fill="currentColor"
          />
          {healthScore} / 100
        </p>
        <p>
          <AlarmClock
            strokeWidth={2.7}
            className="inline mb-1 mr-1 size-4 text-sky-700"
          />
          {recipe.readyInMinutes} min
        </p>
      </div>
    </div>
  );
}
