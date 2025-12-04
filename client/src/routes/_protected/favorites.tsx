import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/favorites")({
  component: RouteComponent,
  staticData: { title: "Favorites" },
});

function RouteComponent() {
  return <div>Hello "/_protected/favorites"!</div>;
}
