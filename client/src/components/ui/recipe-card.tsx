import type { Recipe } from "@neochef/common";
import { Separator } from "./separator";
import { Cross } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatCompactNumber } from "@/lib/format-number";

export function RecipeCard(recipe: Recipe) {
  const calories =
    recipe.caloriesPerServing != null
      ? recipe.caloriesPerServing.toFixed(0)
      : "?";

  const healthScore =
    recipe.healthScore != null ? recipe.healthScore.toFixed(0) : "?";

  return (
    <Link to="/recipes/$recipeId" params={{ recipeId: recipe.id }}>
      <div className="w-2xs rounded-md overflow-hidden shadow-md transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
        <div className="overflow-hidden h-37.5">
          <img
            className="w-full h-full object-cover scale-y-105 scale-x-110"
            src={`https://img.spoonacular.com/recipes/${recipe.sourceId}-480x360.${recipe.imageType}`}
            alt={recipe.title}
          />
        </div>

        <div className="py-3 px-4">
          <h3 className="text-primary text-base font-medium truncate whitespace-nowrap overflow-hidden">
            {recipe.title}
          </h3>
        </div>

        <Separator />

        <div className="py-2.5 px-4 flex justify-between text-xs text-secondary-foreground">
          <p>
            {/* <ThumbsUp
              strokeWidth={2.7}
              className="inline mb-[3.7px] mr-1 text-sky-700"
              size={13}
              // fill="currentColor"
            /> */}
            ❤️ {formatCompactNumber(recipe.likeCount)} likes
          </p>
          <p>
            {/* <Flame
              strokeWidth={2.7}
              size={13}
              className="inline mb-[3.7px] mr-0.5 text-amber-500"
              fill="currentColor"
            /> */}
            🔥 {calories} cal
          </p>
          <p>
            <Cross
              strokeWidth={2}
              size={13}
              className="inline mb-[3.5px] mr-1.5 text-emerald-600"
              fill="currentColor"
            />
            {healthScore} / 100
          </p>
          <p>
            {/* <AlarmClock
              strokeWidth={2.7}
              size={13}
              className="inline mb-[3.7px] mr-1 text-red-700"
            /> */}
            ⏰ {recipe.readyInMinutes} min
          </p>
        </div>
      </div>
    </Link>
  );
}
