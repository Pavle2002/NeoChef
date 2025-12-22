import { useMatches } from "@tanstack/react-router";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";

export function Header() {
  const matches = useMatches();

  const matchWithTitle = [...matches]
    .reverse()
    .find((match) => match.staticData.title);
  const title = matchWithTitle?.staticData.title || "NeoChef";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <h1 className="text-base font-medium">{title}</h1>
    </header>
  );
}
