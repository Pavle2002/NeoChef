import { Button } from "@/components/ui/button";
import { useToggleLike } from "@/mutations/useToggleLike";
import { useToggleSave } from "@/mutations/useToggleSave";
import { getRecipeQueryOptions } from "@/query-options/get-recipe-query-options";
import type { ExtendedRecipe } from "@common/schemas/recipe";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, Heart } from "lucide-react";

export const Route = createFileRoute("/_protected/recipes/$recipeId")({
  component: RouteComponent,
  loader: async ({ params, context: { queryClient } }) => {
    const { recipeId } = params;
    queryClient.ensureQueryData(getRecipeQueryOptions(recipeId));
  },
  staticData: { title: "Recipe Details" },
});

function RouteComponent() {
  const { recipeId } = Route.useParams();
  const { data: extendedRecipe } = useSuspenseQuery(
    getRecipeQueryOptions(recipeId)
  );

  const { recipe, cuisines, diets, dishTypes, equipment, extendedIngredients } =
    extendedRecipe;

  return (
    <div className="container mx-auto space-y-8">
      <HeaderSection
        recipe={recipe}
        diets={diets}
        cuisines={cuisines}
        dishTypes={dishTypes}
      />
      <ActionButtons recipe={recipe} />

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8 ">
          <IngredientsList extendedIngredients={extendedIngredients} />
          <NutritionInfo recipe={recipe} />

          {equipment.length > 0 &&
            recipe.instructions.length + 2 > extendedIngredients.length && (
              <EquipmentList equipment={equipment} />
            )}
        </div>

        <div className="lg:col-span-8">
          <div className="flex flex-col-reverse lg:flex-col gap-8">
            <Instructions instructions={recipe.instructions} />
            {equipment.length > 0 &&
              recipe.instructions.length + 2 <= extendedIngredients.length && (
                <EquipmentList equipment={equipment} />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderSection({
  recipe,
  diets,
  cuisines,
  dishTypes,
}: Pick<ExtendedRecipe, "recipe" | "diets" | "cuisines" | "dishTypes">) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/2 relative">
        <img
          className="w-full h-full lg:absolute lg:inset-0 rounded-xl overflow-hidden shadow-md object-cover"
          src={`https://img.spoonacular.com/recipes/${recipe.sourceId}-636x393.${recipe.imageType}`}
          alt={recipe.title}
        />
      </div>
      <div className="lg:w-1/2 space-y-6">
        <div>
          <h1 className="text-primary text-4xl font-bold mb-3">
            {recipe.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {diets.map((diet) => (
              <span
                key={diet.name}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold uppercase tracking-wide"
              >
                {diet.name}
              </span>
            ))}
            {cuisines.map((cuisine) => (
              <span
                key={cuisine.name}
                className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold uppercase tracking-wide"
              >
                {cuisine.name}
              </span>
            ))}
            {dishTypes.map((type) => (
              <span
                key={type.name}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold uppercase tracking-wide"
              >
                {type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-accent">
          <div>
            <p className="text-sm text-muted-foreground">⏰ Ready in</p>
            <p className="text-primary font-semibold">
              {recipe.readyInMinutes} minutes
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">👥 Servings</p>
            <p className="text-primary font-semibold">
              {recipe.servings} people
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              ⚖️ Weight per serving
            </p>
            <p className="text-primary font-semibold">
              {recipe.weightPerServing} g
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              💵 Price per serving
            </p>
            <p className="text-primary font-semibold">
              ${(recipe.pricePerServing / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButtons({ recipe }: Pick<ExtendedRecipe, "recipe">) {
  const { mutate: toggleLike } = useToggleLike();
  const { mutate: toggleSave } = useToggleSave();

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-center pb-6 border-b border-accent">
      <div className="flex-1">
        <h3 className="text-primary text-2xl font-bold mb-3">
          About this recipe ℹ️
        </h3>
        <div
          className="prose prose-md max-h-44 text-secondary-foreground overflow-y-scroll"
          dangerouslySetInnerHTML={{ __html: recipe.summary }}
        />
      </div>
      <div className="flex flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-auto">
        <Button
          type="button"
          onClick={() =>
            toggleLike({ recipeId: recipe.id, isLiked: recipe.isLiked })
          }
          variant="secondary"
          size="xl"
          className="font-semibold shadow-md flex-1 lg:flex-none flex items-center justify-center gap-2"
        >
          <Heart
            className={`size-5 transition-colors duration-300 fill-current ${
              recipe.isLiked ? "text-red-500" : "text-muted-foreground/40"
            }`}
          />
          {recipe.likeCount} Likes
        </Button>
        <Button
          type="button"
          onClick={() =>
            toggleSave({ recipeId: recipe.id, isSaved: recipe.isSaved })
          }
          variant="secondary"
          size="xl"
          className="font-semibold shadow-md flex-1 lg:flex-none flex items-center justify-center gap-2"
        >
          <Bookmark
            className={`size-5 transition-colors duration-300 fill-current ${
              recipe.isSaved ? "text-yellow-500" : "text-muted-foreground/40"
            }`}
          />
          Save Recipe
        </Button>
      </div>
    </div>
  );
}

function IngredientsList({
  extendedIngredients: ingredients,
}: Pick<ExtendedRecipe, "extendedIngredients">) {
  return (
    <div className="bg-primary-foreground px-6 py-4 rounded-lg shadow-md">
      <h2 className="text-primary text-2xl font-bold mb-4">📝 Ingredients</h2>
      <ul className="space-y-4">
        {ingredients.map((ing) => (
          <li
            key={ing.ingredient.id}
            className="flex items-start gap-2 text-md"
          >
            <span className="font-medium text-primary">
              {Number.parseFloat(ing.usage.amount.toFixed(2))} {ing.usage.unit}
            </span>
            <span className="text-muted-foreground">
              {
                ing.ingredient.name
                  .split(".")[0]
                  .split(" to ")[0]
                  .split(" but ")[0]
              }
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NutritionInfo({ recipe }: Pick<ExtendedRecipe, "recipe">) {
  return (
    <div className="bg-primary-foreground px-6 py-4 rounded-lg shadow-md">
      <h2 className="text-primary text-2xl font-bold mb-4">🥗 Nutrition</h2>
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Calories</span>
          <span className="font-semibold text-primary">
            {recipe.caloriesPerServing || "N/A"} kcal
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Protein</span>
          <span className="font-semibold text-primary">
            {recipe.percentProtein || "N/A"}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Fat</span>
          <span className="font-semibold text-primary">
            {recipe.percentFat || "N/A"}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Carbs</span>
          <span className="font-semibold text-primary">
            {recipe.percentCarbs || "N/A"}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Health Score</span>
          <span className="font-semibold text-primary">
            {recipe.healthScore || "N/A"} / 100
          </span>
        </div>
      </div>
    </div>
  );
}

function EquipmentList({ equipment }: Pick<ExtendedRecipe, "equipment">) {
  return (
    <div className="bg-primary-foreground pl-6 pr-4 py-4 rounded-lg shadow-md">
      <h2 className="text-primary text-2xl font-bold mb-4">🛠️ Equipment</h2>
      <ul className="flex flex-wrap gap-2.5">
        {equipment.map((eq, idx) => (
          <li
            key={idx}
            className="text-md text-muted-foreground px-4 py-2 bg-background border border-border rounded-md shadow-sm"
          >
            {eq.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Instructions({ instructions }: { instructions: string[] }) {
  return (
    <div className="space-y-8">
      <h2 className="text-primary text-3xl font-bold mb-7">📖 Instructions</h2>
      {instructions.map((step, index) => (
        <div key={index} className="flex gap-4 group">
          <div className="flex-shrink-0 size-10 bg-primary text-background rounded-full flex items-center justify-center font-bold shadow-md">
            {index + 1}
          </div>
          <div className="pt-1.5">
            <p className="text-secondary-foreground leading-relaxed text-lg">
              {step}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
