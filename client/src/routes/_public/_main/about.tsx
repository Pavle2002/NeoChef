import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_public/_main/about")({
  head: () => ({
    meta: [
      { title: "NeoChef - Your Personal Cooking Assistant" },
      {
        name: "description",
        content:
          "Learn how NeoChef helps you discover personalized recipes, cook smarter and plan meals tailored to your taste.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.neochef.app/about" }],
  }),
  component: RouteComponent,
});

const STEPS = [
  "Create an account and set your preferences",
  "Tell NeoChef what you have in the fridge",
  "Cook, rate, and let NeoChef learn your taste",
  "Explore personalized recommendation categories",
];

const USERS = [
  "Home cooks looking for new inspiration",
  "Anyone tired of repetitive recipes",
  "Fitness and health-focused individuals",
  "Busy people who want simple meal planning",
];

function RouteComponent() {
  return (
    <div className="container mx-auto py-16 sm:py-24 xl:max-w-5xl">
      <main>
        {/* Header */}
        <section className="flex flex-col items-center text-center gap-4 mb-14">
          <div>
            <Badge className="flex lg:inline-flex mx-auto text-xs sm:text-sm font-medium px-4 py-1.5 text-secondary-foreground bg-secondary border shadow-md rounded-full mb-5">
              <ChefHat /> Cooking Assistent
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
              About NeoChef
            </h1>
          </div>

          <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl">
            NeoChef is an AI-powered cooking assistant designed to help you
            discover recipes, plan meals, and cook smarter — based on your
            personal taste, habits, and lifestyle.
          </p>
        </section>

        {/* Content */}
        <article className="flex flex-col gap-12 text-base sm:text-lg leading-relaxed">
          <Separator />
          {/* Problem */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              The Problem With Traditional Recipe Apps 🫤
            </h2>
            <p className="text-muted-foreground">
              Most recipe apps show the same trending dishes to everyone. They
              don't adapt to individual preferences, dietary habits, or cooking
              routines. As a result, finding meals you actually enjoy, planning
              consistently, and avoiding repetitive cooking quickly becomes
              frustrating.
            </p>
          </section>

          {/* Solution */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              The NeoChef approach 🧠
            </h2>
            <p className="text-muted-foreground">
              NeoChef is built around personalization. Instead of generic
              suggestions, it learns from your preferences, interactions, and
              feedback to deliver recipe recommendations and meal plans tailored
              specifically to you. The more you use NeoChef, the better it
              understands what you like.
            </p>
          </section>

          {/* Who it's for */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Who NeoChef is for 🎯
            </h2>

            <ul className="grid lg:grid-cols-2 gap-4 text-muted-foreground">
              {USERS.map((user, index) => (
                <li key={index} className="flex gap-2 text-base sm:text-lg">
                  <Check color="green" />
                  {user}
                </li>
              ))}
            </ul>
          </section>

          {/* How it works */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-5">
              How NeoChef works ⚙️
            </h2>

            <ul className="text-muted-foreground space-y-4">
              {STEPS.map((step, index) => (
                <li className="flex gap-4 group items-center">
                  <div className="shrink-0 size-10 bg-primary text-background rounded-full flex items-center justify-center font-bold shadow-md">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                    {step}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Trust / project note */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3 mt-2">
              Built with purpose 🧱
            </h2>
            <p className="text-muted-foreground">
              NeoChef is actively developed as a modern web application with a
              strong focus on performance, personalization, and user experience.
              Privacy, simplicity, and long-term usability are core principles
              behind everything we build.
            </p>
          </section>
          <Separator />
        </article>
      </main>

      {/* CTA */}
      <footer className="mt-14 flex flex-col items-center text-center gap-6 ">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Ready to Cook Smarter
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl">
            Start discovering personalized recipes with NeoChef today.
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-7 justify-center lg:justify-start">
          <Button
            className="w-full sm:max-w-3xs text-base lg:text-lg shadow-md h-11 rounded-md px-5 sm:px-8"
            asChild
          >
            <Link to="/register">🍲 Create Free Account</Link>
          </Button>
          <Button
            className="w-full sm:max-w-3xs text-primary text-base lg:text-lg shadow-md h-11 rounded-md px-5 sm:px-8 "
            asChild
            variant="outline"
          >
            <Link to="/about">🔎 Explore Features</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
