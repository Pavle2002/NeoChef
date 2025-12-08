import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/home")({
  component: RouteComponent,
  staticData: { title: "Home" },
});

function RouteComponent() {
  return <div>Hello "/_protected/recommended"!</div>;
}
