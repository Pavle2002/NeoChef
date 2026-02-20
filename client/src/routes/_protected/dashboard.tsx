import { Button } from "@/components/ui/button";
import config from "@/config";
import { useStartTransformJob } from "@/mutations/use-start-transform-job";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { FetchJob, TransformJob, UpsertJob } from "@neochef/common";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSavedPagesQueryOptions } from "@/query-options/get-saved-pages-query-options";

type EventData = {
  type: string;
  job: {
    id: string;
    data: FetchJob | TransformJob | UpsertJob;
    returnValue: unknown | null;
    failedReason?: string;
    stackTrace: string[];
    timestamp: number;
    processedOn?: number;
    finishedOn?: number;
  };
};

export const Route = createFileRoute("/_protected/dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ context: { user } }) => {
    if (!user.isAdmin) {
      throw new Error("You are not authorized to access this page.");
    }
  },
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getSavedPagesQueryOptions()),
  staticData: { title: "Dashboard" },
});

function RouteComponent() {
  const { mutate } = useStartTransformJob();
  const { data: savedPages } = useSuspenseQuery(getSavedPagesQueryOptions());
  console.log(savedPages);

  return (
    <>
      <h2 className="text-3xl text-primary font-bold">Background Jobs</h2>
      <p className="text-muted-foreground mb-4"></p>
      <BackgroundJobsTable />
      <Button onClick={() => mutate(0)}>Start Transform Job</Button>
    </>
  );
}

function BackgroundJobsTable() {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(`${config.apiUrl}/jobs/events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as EventData;
      console.log(data);
      setEvents((prevLogs) => [data, ...prevLogs]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <Table className="text-center">
      <TableHeader className="bg-background sticky top-0 outline outline-border">
        <TableRow>
          <TableHead className="text-center">Type</TableHead>
          <TableHead className="text-center">Correlation ID</TableHead>
          <TableHead className="text-center">Message</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event, index) => (
          <TableRow key={index}>
            <TableCell>{event.job.data.type}</TableCell>
            <TableCell>{event.job.data.correlationId}</TableCell>
            <TableCell>{getMessageForJob(event.job.data)}</TableCell>
            <TableCell>{event.type} </TableCell>
            <TableCell>
              {formatJobDuration(event.job.processedOn, event.job.finishedOn)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function formatJobDuration(start?: number, end?: number) {
  if (!end || !start) return "In progress";
  const duration = end - start;
  if (duration < 1000) {
    return `${duration} ms`;
  } else if (duration < 60 * 1000) {
    return `${(duration / 1000).toFixed(2)} s`;
  } else {
    return `${(duration / (60 * 1000)).toFixed(2)} min`;
  }
}

function getMessageForJob(job: FetchJob | TransformJob | UpsertJob) {
  switch (job.type) {
    case "Fetch":
      return `Fetching page ${job.page}`;
    case "Transform":
      return `Transforming page ${job.page}`;
    case "Upsert":
      return `Upserting recipe with source Id ${job.extendedRecipeData.recipeData.sourceId}`;
  }
}
