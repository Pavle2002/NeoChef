import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "./carousel";
import { Skeleton } from "./skeleton";

export function RecipeCarouselSkeleton() {
  return (
    <Carousel
      className="w-[95%] max-w-6xl"
      opts={{ align: "start", loop: true }}
    >
      <CarouselContent className="-ml-4 mr-3">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 2xl:basis-1/5 pl-4 py-4"
            >
              <Skeleton className="aspect-4/3 w-full overflow-hidden rounded-xl shadow-md"></Skeleton>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
}
