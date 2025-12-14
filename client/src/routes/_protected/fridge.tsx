import { IngredientSelectorPopover } from "@/components/ui/ingredient-selector";
import { Button } from "@/components/ui/button";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useUpdateFridge } from "@/mutations/use-update-fridge";
import { getCurrentUserFridgeQueryOptions } from "@/query-options/get-current-user-fridge-query-options";
import type { Ingredient } from "@common/schemas/ingredient";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  useForm,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

export const Route = createFileRoute("/_protected/fridge")({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getCurrentUserFridgeQueryOptions());
  },
  component: RouteComponent,
  staticData: { title: "Fridge" },
});

function RouteComponent() {
  const { data: fridge } = useSuspenseQuery(getCurrentUserFridgeQueryOptions());

  const { mutate: updateFridge, isPending } = useUpdateFridge();

  const form = useForm({
    defaultValues: { fridge },
  });

  function handleReset() {
    form.setValue("fridge", []);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          updateFridge(data.fridge);
        })}
        className="space-y-7 max-w-4xl"
      >
        <IngredientSearchField control={form.control} name="fridge" />
        <Separator />

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="shadow-sm"
          >
            Empty Fridge
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="shadow-sm"
          >
            {isPending ? "Saving..." : "Save Fridge"}
          </Button>
        </div>
      </form>
    </Form>
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
            Ingredients you have in your fridge
            <IngredientSelectorPopover
              onValueChange={field.onChange}
              value={field.value}
            />
          </FormLabel>
          <span className="block text-muted-foreground text-sm mb-2">
            (Click on ingredients you want to remove from the fridge)
          </span>
          <FormControl>
            <div>
              {(!field.value || field.value.length === 0) && (
                <p className="mt-4 text-md text-muted-foreground">
                  You have no ingredients in your fridge
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
