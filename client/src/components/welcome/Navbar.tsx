import React from "react";
import { Button } from "@/components/ui/button";
import { logoImage } from "@/assets/index.tsx";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

type NavbarProps = React.ComponentPropsWithoutRef<"nav">;

export default function Navbar({ className, ...props }: NavbarProps) {
  return (
    <nav
      className={cn(
        "flex flex-row items-center justify-between p-4",
        className
      )}
      {...props}
    >
      <div className="flex flex-row items-center gap-1">
        <img src={logoImage} alt="Logo" className="size-9" />
        <p className="text-md font-medium text-primary">NeoChef</p>
      </div>
      <div className="flex flex-row items-center gap-4">
        <Button variant="link" asChild={true}>
          <Link to="/">Features</Link>
        </Button>
        <Button variant="link" asChild={true}>
          <Link to="/">About us</Link>
        </Button>
        <Button variant="default" asChild={true} className="ml-4">
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </nav>
  );
}
