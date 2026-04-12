import { Link } from "@tanstack/react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "./carousel";
import type { Recipe } from "@neochef/common";
import { Image } from "./image";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type RecipeCarouselProps = {
  recipes: Recipe[];
  popoverContent?: (recipe: Recipe) => React.ReactNode;
};

export function RecipeCarousel({
  recipes,
  popoverContent,
}: RecipeCarouselProps) {
  return (
    <Carousel
      className="sm:w-[95%] max-w-6xl"
      opts={{ align: "start", loop: true }}
    >
      <CarouselContent className="-ml-4 sm:mr-3">
        {recipes.map((recipe) => (
          <CarouselItem
            key={recipe.id}
            className="relative basis-1/2 sm:basis-1/3 lg:basis-1/4 2xl:basis-1/5 pl-4 py-4"
          >
            <Link
              to="/recipes/$recipeId"
              params={{ recipeId: recipe.id }}
              className="group relative block overflow-hidden rounded-lg sm:rounded-xl shadow-lg "
            >
              <div className="aspect-4/3 w-full overflow-hidden ">
                <Image
                  src={`https://img.spoonacular.com/recipes/${recipe.sourceId}-480x360.${recipe.imageType}`}
                  alt={recipe.title}
                  className="scale-120 transition-transform duration-250 group-hover:scale-125"
                />
              </div>

              <div className="absolute inset-0 bg-linear-to-t from-foreground/85 via-foreground/30 to-transparent" />

              <div className="absolute bottom-0 w-full p-3 sm:p-4">
                <h3 className="line-clamp-2 text-sm xl:text-base font-medium leading-tight text-background">
                  {recipe.title}
                </h3>
              </div>
            </Link>
            {popoverContent && (
              <Popover>
                <PopoverTrigger asChild>
                  <Info
                    strokeWidth={2.5}
                    size={20}
                    className="absolute text-background top-6 left-6.5 rounded-full cursor-pointer"
                  />
                </PopoverTrigger>
                <PopoverContent align="center">
                  {popoverContent(recipe)}
                </PopoverContent>
              </Popover>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
