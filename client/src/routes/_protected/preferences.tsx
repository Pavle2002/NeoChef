import {
  useForm,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { IngredientSelectorPopover } from "@/components/ui/ingredient-selector";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUserPreferencesQueryOptions } from "@/query-options/get-current-user-preferences-query-options";
import { useSuspenseQueries } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useUpdatePreferences } from "@/mutations/useUpdatePreferences";
import type { Cuisine } from "@common/schemas/cuisine";
import type { Diet } from "@common/schemas/diet";
import type { Ingredient } from "@common/schemas/ingredient";
import { getCuisinesQueryOptions } from "@/query-options/get-cuisines-query-options";
import { getDietsQueryOptions } from "@/query-options/get-diets-query-options";

export const Route = createFileRoute("/_protected/preferences")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getCurrentUserPreferencesQueryOptions());
    queryClient.ensureQueryData(getCuisinesQueryOptions());
    queryClient.ensureQueryData(getDietsQueryOptions());
  },
  staticData: { title: "Preferences" },
});

function RouteComponent() {
  const [{ data: preferences }, { data: cuisines }, { data: diets }] =
    useSuspenseQueries({
      queries: [
        getCurrentUserPreferencesQueryOptions(),
        getCuisinesQueryOptions(),
        getDietsQueryOptions(),
      ],
    });

  const { mutate: updatePreferences, isPending } = useUpdatePreferences();

  const form = useForm({
    defaultValues: preferences,
  });

  function handleReset() {
    form.setValue("dislikesIngredients", []);
    form.setValue("prefersCuisines", []);
    form.setValue("followsDiets", []);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          updatePreferences(data);
        })}
        className="space-y-7 max-w-4xl"
      >
        <IngredientSearchField
          control={form.control}
          name="dislikesIngredients"
        />
        <Separator />

        <CheckboxGroupField
          control={form.control}
          name="prefersCuisines"
          label="Cuisines you prefer"
          options={cuisines}
          description="(Select the cuisines you prefer)"
        />
        <Separator />

        <CheckboxGroupField
          control={form.control}
          name="followsDiets"
          label="Diets you follow"
          options={diets}
          description="(Select the diets you follow)"
        />
        <Separator />

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="shadow-sm"
          >
            Clear Preferences
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="shadow-sm"
          >
            {isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

type CheckboxGroupFieldProps<T extends FieldValues> = {
  options: (Diet | Cuisine)[];
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
  description = "",
}: CheckboxGroupFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mb-3 text-xl font-normal block">
            {label}
            <span className="text-muted-foreground block sm:inline text-sm ml-1">
              {description}
            </span>
          </FormLabel>
          <FormControl>
            <CheckboxGroup
              className="flex flex-wrap gap-3"
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
          <FormLabel className="text-xl font-normal">
            Ingredients you dislike
            <IngredientSelectorPopover
              onValueChange={field.onChange}
              value={field.value}
            />
          </FormLabel>
          <span className="block text-muted-foreground text-sm mb-2">
            (Click on ingredients you want to remove from the list)
          </span>
          <FormControl>
            <div>
              {(!field.value || field.value.length === 0) && (
                <p className="mt-4 text-md text-muted-foreground">
                  No ingredients selected
                </p>
              )}
              <CheckboxGroup
                className="flex flex-wrap gap-3"
                options={field.value as Ingredient[]}
                getKey={(ingredient) => ingredient.id}
                getLabel={(ingredient) => ingredient.name}
                value={field.value}
                onValueChange={field.onChange}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
