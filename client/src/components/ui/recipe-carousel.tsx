import { Link } from "@tanstack/react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "./carousel";
import type { Recipe } from "@common/schemas/recipe";

export function RecipeCarousel({ recipes }: { recipes: Recipe[] }) {
  return (
    <Carousel
      className="w-[95%] max-w-6xl"
      opts={{ align: "start", loop: true }}
    >
      <CarouselContent className="-ml-4 mr-3">
        {recipes.map((recipe) => (
          <CarouselItem
            key={recipe.id}
            className="basis-1/3 lg:basis-1/4 2xl:basis-1/5 pl-4 py-4"
          >
            <Link
              to="/recipes/$recipeId"
              params={{ recipeId: recipe.id }}
              className="group relative block overflow-hidden rounded-xl shadow-lg "
            >
              <div className="aspect-4/3 w-full overflow-hidden ">
                <img
                  src={`https://img.spoonacular.com/recipes/${recipe.sourceId}-480x360.${recipe.imageType}`}
                  alt={recipe.title}
                  className="h-full w-full object-cover object-center scale-120 transition-transform duration-250 group-hover:scale-125"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />

              <div className="absolute bottom-0 w-full p-4">
                <h3 className="line-clamp-2 text-sm xl:text-base font-medium leading-tight text-background">
                  {recipe.title}
                </h3>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
}
