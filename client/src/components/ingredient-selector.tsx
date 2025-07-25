import type { Ingredient } from "@/types/ingredient";
import { LiveSearch } from "./ui/live-search";
import { getIngredientsQueryOptions } from "@/query-options/get-ingredients-query-options";
import { Check } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";

export type IngredientSelectorProps = {
  value: Ingredient[];
  onValueChange: (value: Ingredient[]) => void;
};

export function IngredientSelector({
  value,
  onValueChange,
}: IngredientSelectorProps) {
  const valueSet = new Set(value.map((i) => i.id));

  return (
    <LiveSearch
      inputPlaceholder="Search ingredients..."
      getQueryOptions={getIngredientsQueryOptions}
      getResultKey={(ingredient) => ingredient.id}
      renderResultItem={(ingredient) => (
        <>
          {ingredient.name}
          {valueSet.has(ingredient.id) && <Check className="ml-auto size-4" />}
        </>
      )}
      renderPendingResult={
        <div className="flex flex-col gap-1.5 p-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-7" />
          ))}
        </div>
      }
      onSelectItem={(ingredient) => {
        if (valueSet.has(ingredient.id)) {
          onValueChange(value.filter((i) => i.id !== ingredient.id));
        } else {
          onValueChange([...value, ingredient]);
        }
      }}
    />
  );
}

export function ResponsiveIngredientSelector({
  onValueChange,
  value,
  ...props
}: IngredientSelectorProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button className="max-w-fit">Select ingredients</Button>
        </PopoverTrigger>
        <PopoverContent>
          <IngredientSelector
            onValueChange={onValueChange}
            value={value}
            {...props}
          />
        </PopoverContent>
      </Popover>
    );
  } else {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="max-w-fit">Select ingredients</Button>
        </DrawerTrigger>
        <DrawerContent>
          <IngredientSelector
            onValueChange={onValueChange}
            value={value}
            {...props}
          />
        </DrawerContent>
      </Drawer>
    );
  }
}
