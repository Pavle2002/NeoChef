import { Button } from "@/components/ui/button";
import config from "@/config";
import { useStartTransformJob } from "@/mutations/use-start-transform-job";
import { getUnmappedIngredientsQueryOptions } from "@/query-options/get-unmapped-ingredients-query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
      <div>
        {unmappedIngredients.map((ingredient) => (
          <p key={ingredient.id}>{ingredient.name}</p>
        ))}
      </div>
      <Button onClick={() => mutate(0)}>Start Transform Job</Button>
      <div>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </>
  );
}
