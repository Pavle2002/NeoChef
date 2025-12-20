import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { AuthContext } from "@/context/auth";
import { getCurrentUserQueryOptions } from "@/query-options/get-current-user-query-options";

type RouterContext = {
  queryClient: QueryClient;
  auth: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context: { auth, queryClient } }) => {
    const user = await queryClient.ensureQueryData(
      getCurrentUserQueryOptions()
    );
    auth.setUser(user);
  },

  component: () => (
    <div className="h-screen">
      <Outlet />
    </div>
  ),
});
