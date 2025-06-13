import { currentUserQueryOptions } from "@/queries/current-user-query-options";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context: { queryClient, auth } }) => {
    const user = await queryClient.ensureQueryData(currentUserQueryOptions());
    auth.setUser(user);
    if (!auth.isAuthenticated) {
      throw redirect({ to: "/login", replace: true });
    }
  },
});
