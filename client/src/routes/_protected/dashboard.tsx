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
import { Suspense, useEffect, useState } from "react";
import type { Ingredient } from "@neochef/common";
import { getSimilarIngredientsQueryOptions } from "@/query-options/get-similar-ingredients";

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
      const { type, jobId } = JSON.parse(event.data) as {
        type: string;
        jobId: string;
      };
      setLogs((prevLogs) => [...prevLogs, `Job ${jobId} ${type}`]);
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Resolve Mapping</DialogTitle>
          <DialogDescription className="text-md ">
            Choose closest canonical ingredient or create new one
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={<p>Loading similar ingredients...</p>}>
          <SimilarIngredientsList ingredient={ingredient} />
        </Suspense>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SimilarIngredientsList({ ingredient }: { ingredient: Ingredient }) {
  const { data: similarIngredients } = useSuspenseQuery(
    getSimilarIngredientsQueryOptions(ingredient.id, 10),
  );

  return similarIngredients.length > 0 ? (
    similarIngredients.map(({ match, confidence }) => (
      <div key={match.id}>
        <p className="text-sm">
          {match.name} (confidence: {confidence})
        </p>
      </div>
    ))
  ) : (
    <p className="text-sm">No similar ingredients found.</p>
  );
}
