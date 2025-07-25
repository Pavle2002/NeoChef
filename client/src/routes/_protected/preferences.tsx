import {
  useForm,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { Cuisine } from "@/types/cuisine";
import type { Diet } from "@/types/diet";
import { Button } from "@/components/ui/button";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { ResponsiveIngredientSelector } from "@/components/ingredient-selector";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUserPreferencesQueryOptions } from "@/query-options/get-current-user-preferences-query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

export const Route = createFileRoute("/_protected/preferences")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getCurrentUserPreferencesQueryOptions()),
});

const diets = [
  { name: "Vegetarian" },
  { name: "Vegan" },
  { name: "Gluten-Free" },
  { name: "Paleo" },
  { name: "Keto" },
  { name: "Mediterranean" },
];

const cuisines = [
  { name: "Italian" },
  { name: "Chinese" },
  { name: "Mexican" },
  { name: "Japanese" },
  { name: "Indian" },
  { name: "French" },
  { name: "Thai" },
  { name: "Greek" },
];

function RouteComponent() {
  const { data: preferences } = useSuspenseQuery(
    getCurrentUserPreferencesQueryOptions()
  );

  const form = useForm({
    defaultValues: preferences,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="space-y-6"
      >
        <CheckboxGroupField
          control={form.control}
          name="followsDiets"
          label="Diets you follow"
          options={diets}
        />

        <CheckboxGroupField
          control={form.control}
          name="prefersCuisines"
          label="Cuisines you prefer"
          options={cuisines}
        />

        <IngredientSearchField
          control={form.control}
          name="dislikesIngredients"
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Save Preferences
        </Button>
      </form>
    </Form>
  );
}

type CheckboxGroupFieldProps<T extends FieldValues> = {
  options: (Diet | Cuisine)[];
  label: string;
  name: Path<T>;
  control: Control<T>;
};

function CheckboxGroupField<T extends FieldValues>({
  options,
  control,
  name,
  label,
}: CheckboxGroupFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mb-3 text-base">{label}</FormLabel>
          <FormControl>
            <CheckboxGroup
              className="flex flex-col gap-3"
              options={options}
              value={field.value}
              onValueChange={field.onChange}
              getKey={(option) => option.name}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

type IngredientSearchFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
};

function IngredientSearchField<T extends FieldValues>({
  name,
  control,
}: IngredientSearchFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mb-3 text-base">
            Ingredients you dislike
          </FormLabel>
          <ResponsiveIngredientSelector
            onValueChange={field.onChange}
            value={field.value}
          />
        </FormItem>
      )}
    />
  );
}
