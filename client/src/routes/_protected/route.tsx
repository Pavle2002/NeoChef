import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/mutations/useLogout";
import { getCurrentUserQueryOptions } from "@/queries/get-current-user-query-options";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import {
  ChefHat,
  Home,
  Refrigerator,
  Settings,
  Star,
  TrendingUp,
  User,
  MoreVertical,
  LogOut,
} from "lucide-react";

const PAGES = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Trending",
    url: "/trending",
    icon: TrendingUp,
  },
  {
    title: "Fridge",
    url: "/fridge",
    icon: Refrigerator,
  },
  {
    title: "Preferences",
    url: "/preferences",
    icon: User,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: Star,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: Settings,
  },
] as const;

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
  const { pathname } = useLocation();

  const getCurrentPageTitle = () => {
    const currentPage = PAGES.find((page) => page.url === pathname);
    return currentPage?.title || "NeoChef";
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{getCurrentPageTitle()}</h1>
        </header>

        <div className="my-10 mx-8">
          <Outlet />
        </div>
        {/* <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted aspect-video rounded-xl" />
            <div className="bg-muted aspect-video rounded-xl" />
            <div className="bg-muted aspect-video rounded-xl" />
          </div>
          <div className="bg-muted min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppSidebar() {
  return (
    <Sidebar>
      <Header />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {PAGES.filter((page) => page.url !== "/profile").map((page) => (
                <SidebarMenuItem key={page.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={page.url}
                      activeProps={{
                        className:
                          "bg-accent text-accent-foreground font-semibold",
                      }}
                    >
                      <page.icon strokeWidth={2.2} />
                      <span>{page.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Footer />
    </Sidebar>
  );
}

function Header() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="data-[slot=sidebar-menu-button]:!p-1.5"
          >
            <Link to="/home">
              <ChefHat className="!size-5 " strokeWidth={2.7} />
              <span className="text-base font-semibold">NeoChef</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

function Footer() {
  const { isMobile } = useSidebar();
  const { mutate: logout, isPending } = useLogout();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <UserInfo />
                <MoreVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserInfo />
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to="/profile" className="w-full">
                  <DropdownMenuItem>
                    <User />
                    Profile
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} disabled={isPending}>
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

function UserInfo() {
  const { user } = Route.useRouteContext();

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user.avatarUrl} alt={user.username} />
        <AvatarFallback className="rounded-lg">
          {user.username.at(0)?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.username}</span>
        <span className="text-muted-foreground truncate text-xs">
          {user.email}
        </span>
      </div>
    </div>
  );
}
