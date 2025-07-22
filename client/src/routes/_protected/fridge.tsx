import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/fridge")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_protected/fridge"!</div>;
}
