import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChefHat } from "lucide-react";

export const Route = createFileRoute("/_public/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen w-full px-5 sm:px-6 xl:px-10 2xl:px-16">
      <main className="container mx-auto py-16 sm:py-24 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <Badge className="flex lg:inline-flex mx-auto text-xs sm:text-sm font-medium px-4 py-1.5 text-secondary-foreground bg-secondary border shadow-md rounded-full mb-3.5">
            <ChefHat /> Smart Cooking
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Cooking, personalized.
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
            NeoChef is an AI-powered cooking assistant designed to help you
            discover recipes, plan meals, and cook smarter — based on your
            personal taste and habits.
          </p>
        </div>

        {/* Content */}
        <section className="flex flex-col gap-12 text-base sm:text-lg leading-relaxed">
          {/* Problem */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              The problem
            </h2>
            <p className="text-muted-foreground">
              Most recipe apps show the same trending dishes to everyone.
              Finding meals you actually enjoy, planning consistently, and
              avoiding repetitive cooking quickly becomes frustrating.
            </p>
          </div>

          {/* Solution */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              The NeoChef approach
            </h2>
            <p className="text-muted-foreground">
              NeoChef adapts to you. By learning from your preferences,
              interactions, and cooking habits, it delivers personalized recipe
              recommendations and smart meal planning — not generic suggestions.
            </p>
          </div>

          {/* Who it's for */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Who NeoChef is for
            </h2>

            <ul className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
              <li className="flex gap-2">
                <Check className="text-green-600 shrink-0" />
                Busy people who want simple meal planning
              </li>
              <li className="flex gap-2">
                <Check className="text-green-600 shrink-0" />
                Home cooks looking for inspiration
              </li>
              <li className="flex gap-2">
                <Check className="text-green-600 shrink-0" />
                Students and young professionals
              </li>
              <li className="flex gap-2">
                <Check className="text-green-600 shrink-0" />
                Anyone tired of repetitive recipes
              </li>
            </ul>
          </div>

          {/* How it works */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              How it works
            </h2>

            <ol className="list-decimal list-inside text-muted-foreground space-y-2">
              <li>Create an account and set your preferences</li>
              <li>Explore personalized recipe recommendations</li>
              <li>Build smart meal plans with ease</li>
              <li>Cook, rate, and let NeoChef learn your taste</li>
            </ol>
          </div>

          {/* Trust / project note */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              Built with purpose
            </h2>
            <p className="text-muted-foreground">
              NeoChef is actively developed as a modern web application with a
              strong focus on performance, personalization, and user experience.
              Privacy and simplicity are core principles.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <Button size="lg" className="text-base px-8" asChild>
            <Link to="/register">Get started with NeoChef</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
