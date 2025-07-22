import { useLocation } from "@tanstack/react-router";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { PAGES } from "@/lib/pages";

export function Header() {
  const { pathname } = useLocation();

  const getCurrentPageTitle = () => {
    const currentPage = PAGES.find((page) => page.url === pathname);
    return currentPage?.title || "NeoChef";
  };
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <h1 className="text-base font-medium">{getCurrentPageTitle()}</h1>
    </header>
  );
}
