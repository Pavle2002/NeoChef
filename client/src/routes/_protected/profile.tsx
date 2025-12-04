import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/profile")({
  component: RouteComponent,
  staticData: { title: "Profile" },
});

function RouteComponent() {
  return <div>Hello "/_protected/profile"!</div>;
}
