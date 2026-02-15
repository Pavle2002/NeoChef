import type { Ingredient } from "@neochef/common";
import { Image } from "./image";
import { cn } from "@/lib/utils";

export type IngredientListProps = {
  ingredients: Ingredient[];
  onClick?: (ingredient: Ingredient) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">;

export function IngredientList({
  ingredients,
  className,
  onClick,
}: IngredientListProps) {
  return (
    <div className={cn("flex flex-wrap gap-5", className)}>
      {ingredients.map((ingredient) => (
        <div
          key={ingredient.id}
          className="flex justify-center items-center gap-2 px-4 py-2 font-medium border border-border shadow-md rounded-sm bg-secondary text-primary cursor-pointer hover:border-primary"
          onClick={() => onClick?.(ingredient)}
        >
          <Image
            className="rounded-md size-6"
            src={`https://img.spoonacular.com/ingredients_100x100/${ingredient.image}`}
            alt={ingredient.name}
          />
          <p className="text-sm">{ingredient.name}</p>
        </div>
      ))}
    </div>
  );
}
