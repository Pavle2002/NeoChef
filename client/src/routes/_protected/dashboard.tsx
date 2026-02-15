import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { IngredientList } from "@/components/ui/ingredient-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import config from "@/config";
import { useStartTransformJob } from "@/mutations/use-start-transform-job";
import { getUnmappedIngredientsQueryOptions } from "@/query-options/get-unmapped-ingredients-query-options";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Ingredient } from "@neochef/common";
import { getSimilarIngredientsQueryOptions } from "@/query-options/get-similar-ingredients";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAddIngredientMapping } from "@/mutations/use-add-ingredient-mapping";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_protected/dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ context: { user } }) => {
    if (!user.isAdmin) {
      throw new Error("You are not authorized to access this page.");
    }
  },
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getUnmappedIngredientsQueryOptions()),
  staticData: { title: "Dashboard" },
});

function RouteComponent() {
  const [logs, setLogs] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient | null>(
    null,
  );
  const { mutate } = useStartTransformJob();
  const { data: unmappedIngredients } = useSuspenseQuery(
    getUnmappedIngredientsQueryOptions(),
  );

  useEffect(() => {
    const eventSource = new EventSource(`${config.apiUrl}/jobs/events`);

    eventSource.onmessage = (event) => {
      const { type, job } = JSON.parse(event.data) as {
        type: string;
        job: any;
      };
      console.log(job);
      setLogs((prevLogs) => [...prevLogs, `${job.name} ${type}`]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      <h2 className="text-3xl text-primary font-bold">Unmapped Ingredients</h2>
      <p className="text-muted-foreground mb-4">
        Click on the button to manually resolve the mapping
      </p>
      <ScrollArea className="h-96 mb-4 rounded-md inset-shadow-lg/15">
        <IngredientList
          onClick={(ingredient) => {
            setCurrentIngredient(ingredient);
            setOpen(true);
          }}
          className="bg-accent/40 px-8 py-7 "
          ingredients={unmappedIngredients}
        />
      </ScrollArea>
      {currentIngredient && (
        <IngredientMappingDialog
          open={open}
          onOpenChange={setOpen}
          ingredient={currentIngredient}
        />
      )}
      <Button onClick={() => mutate(0)}>Start Transform Job</Button>
      <div>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </>
  );
}

type IngredientMappingDialogProps = {
  ingredient: Ingredient;
} & React.ComponentProps<typeof Dialog>;

function IngredientMappingDialog({
  open,
  onOpenChange,
  ingredient,
}: IngredientMappingDialogProps) {
  const { mutate } = useAddIngredientMapping();

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const canonicalId = formData.get("canonicalId") as string;
    mutate({ canonicalId, ingredientId: ingredient.id, confidence: 1.0 });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl">Resolve Mapping</DialogTitle>
          <DialogDescription className="text-md ">
            Choose closest canonical ingredient or create new one
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-80 rounded-md inset-shadow-lg/10">
            <Suspense fallback={<SimilarIngredientsSkeleton />}>
              <SimilarIngredientsList ingredient={ingredient} />
            </Suspense>
          </ScrollArea>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Mapping</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SimilarIngredientsList({ ingredient }: { ingredient: Ingredient }) {
  const { data: similarIngredients } = useSuspenseQuery(
    getSimilarIngredientsQueryOptions(ingredient.id),
  );
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>(
    similarIngredients[0]!.match.id,
  );
  const radioGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (radioGroupRef.current) {
      radioGroupRef.current.focus();
    }
  }, [similarIngredients]);

  return (
    <RadioGroup
      className="p-3"
      ref={radioGroupRef}
      name="canonicalId"
      value={selectedIngredientId}
      onValueChange={setSelectedIngredientId}
    >
      {similarIngredients.map(({ match, confidence }) => (
        <Label
          key={match.id}
          htmlFor={match.id}
          className={`p-3 border rounded-sm bg-accent/50 hover:bg-accent hover:border-primary/50 cursor-pointer
            ${match.id === selectedIngredientId ? "bg-accent border-primary/50" : ""}`}
        >
          <RadioGroupItem className="sr-only" id={match.id} value={match.id} />
          {match.name} - {(confidence * 100).toFixed(0)}%
        </Label>
      ))}
    </RadioGroup>
  );
}

function SimilarIngredientsSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-3">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton className="h-10" key={index} />
      ))}
    </div>
  );
}
