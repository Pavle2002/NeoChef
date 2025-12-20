import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ context: { auth } }) => {
    if (!auth.isAuthenticated) {
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
        <div className="flex flex-col flex-1 my-6 mx-4 sm:mx-8 pb-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
