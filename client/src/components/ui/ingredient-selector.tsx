import type { Ingredient } from "@common/schemas/ingredient";
import { LiveSearch } from "./live-search";
import { getIngredientsQueryOptions } from "@/query-options/get-ingredients-query-options";
import { Check, Plus } from "lucide-react";
import { Skeleton } from "./skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";

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

export function IngredientSelectorPopover({
  onValueChange,
  value,
  ...props
}: IngredientSelectorProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="font-normal">
            <Plus strokeWidth={3} />
            Add more
          </Button>
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
          <Button size="sm" variant="outline" className="font-normal">
            Add more
            <Plus strokeWidth={3} />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-2">
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
