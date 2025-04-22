import { ChefHat } from "lucide-react";
import { Link, Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      <Link
        to="/"
        className="absolute flex items-center gap-1 m-6 md:m-10 font-medium text-lg text-secondary-foreground lg:text-primary-foreground z-10 hover:underline underline-offset-4"
      >
        <div className="flex h-8 w-8 items-center justify-center ">
          <ChefHat className="size-7" />
        </div>
        Neo Chef
      </Link>
      <div className="hidden bg-primary lg:flex">
        <div className="flex flex-col self-end m-10 gap-2 text-primary-foreground ">
          <p className="border-l-2 pl-6">
            “This app completely changed how I cook — I just list what I have,
            and it instantly finds recipes that match my taste and diet. It's
            like having a personal chef who gets me.”
          </p>
          <p className="text-sm pl-6">Sofia Davis</p>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
