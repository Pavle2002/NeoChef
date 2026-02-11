import { Button } from "@/components/ui/button";
import config from "@/config";
import { useStartTransformJob } from "@/mutations/use-start-transform-job";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_protected/dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ context: { user } }) => {
    if (!user.isAdmin) {
      throw new Error("You are not authorized to access this page.");
    }
  },
  staticData: { title: "Dashboard" },
});

function RouteComponent() {
  const [logs, setLogs] = useState<string[]>([]);

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

  const { mutate } = useStartTransformJob();

  return (
    <>
      <Button onClick={() => mutate(0)}>Start Transform Job</Button>
      <div>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </>
  );
}
