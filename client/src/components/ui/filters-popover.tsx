import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import {
  useForm,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { RecipeFilters } from "@common/schemas/recipe";
import { Suspense, useState } from "react";
import { useSuspenseQueries } from "@tanstack/react-query";
import { getCuisinesQueryOptions } from "@/query-options/get-cuisines-query-options";
import { getDietsQueryOptions } from "@/query-options/get-diets-query-options";
import { getDishTypesQueryOptions } from "@/query-options/get-dish-types-query-options";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

type FiltersFormProps = {
  defaultValues?: RecipeFilters;
  onApply: (data: RecipeFilters) => void;
};

function FiltersPopover({ defaultValues = {}, onApply }: FiltersFormProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  function handleApply(filters: RecipeFilters) {
    onApply(filters);
    setOpen(false);
  }

  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="font-normal mb-5">
            <ListFilter strokeWidth={2.5} />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-lg px-4">
          <Suspense
            fallback={<FiltersFormPendingComponent className="h-[370px]" />}
          >
            <FiltersForm defaultValues={defaultValues} onApply={handleApply} />
          </Suspense>
        </PopoverContent>
      </Popover>
    );
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="font-normal mb-5">
            <ListFilter strokeWidth={2.5} />
            Filters
          </Button>
        </DrawerTrigger>
        <DrawerContent className="mb-2 px-4">
          <Suspense fallback={<FiltersFormPendingComponent className="h-96" />}>
            <ScrollArea className="h-96">
              <FiltersForm
                defaultValues={defaultValues}
                onApply={handleApply}
              />
            </ScrollArea>
          </Suspense>
        </DrawerContent>
      </Drawer>
    );
  }
}

function FiltersFormPendingComponent({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Spinner />
    </div>
  );
}

function FiltersForm({ defaultValues = {}, onApply }: FiltersFormProps) {
  const [{ data: cuisines }, { data: diets }, { data: dishTypes }] =
    useSuspenseQueries({
      queries: [
        getCuisinesQueryOptions(),
        getDietsQueryOptions(),
        getDishTypesQueryOptions(),
      ],
    });

  const form = useForm({
    defaultValues: {
      cuisines: defaultValues.cuisines || [],
      diets: defaultValues.diets || [],
      dishTypes: defaultValues.dishTypes || [],
    },
  });

  function handleReset() {
    form.setValue("cuisines", []);
    form.setValue("diets", []);
    form.setValue("dishTypes", []);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="space-y-4">
        <CheckboxGroupField
          control={form.control}
          name="cuisines"
          label="Cuisines"
          options={cuisines.map((cuisine) => cuisine.name)}
          description="(Select the cuisines you prefer)"
        />

        <CheckboxGroupField
          control={form.control}
          name="diets"
          label="Diets"
          options={diets.map((diet) => diet.name)}
          description="(Select the diets you follow)"
        />

        <CheckboxGroupField
          control={form.control}
          name="dishTypes"
          label="Dish types"
          options={dishTypes.map((dishType) => dishType.name)}
          description="(Select the dish types you want to see)"
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="font-normal"
          >
            Clear
          </Button>
          <Button type="submit" size="sm" className="font-normal">
            Apply
          </Button>
        </div>
      </form>
    </Form>
  );
}

type CheckboxGroupFieldProps<T extends FieldValues> = {
  options: string[];
  label: string;
  name: Path<T>;
  control: Control<T>;
  description?: string;
};

function CheckboxGroupField<T extends FieldValues>({
  options,
  control,
  name,
  label,
  description,
}: CheckboxGroupFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className=" text-base font-normal block">
            {label}
            <span className="text-muted-foreground inline text-xs ml-1.5">
              {description}
            </span>
          </FormLabel>
          <FormControl>
            <CheckboxGroup
              size="xs"
              className="flex flex-wrap gap-1"
              options={options}
              value={field.value}
              onValueChange={field.onChange}
              getKey={(option) => option}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export { type FiltersFormProps, FiltersPopover, FiltersForm };
