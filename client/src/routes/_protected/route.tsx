import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUserQueryOptions } from "@/query-options/get-current-user-query-options";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context: { auth, queryClient } }) => {
    const user = await queryClient.ensureQueryData(
      getCurrentUserQueryOptions()
    );
    auth.setUser(user);

    if (!auth.user) {
      throw redirect({ to: "/login", replace: true });
    }
    return {
      user: auth.user,
    };
  },
  component: SidebarLayout,
});

function SidebarLayout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
        <div className="my-6 mx-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
