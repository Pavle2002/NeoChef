import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChefHat } from "lucide-react";
import { Image } from "@/components/ui/image";
import sweets from "@/assets/images/landing/sweet.avif";
import pastry from "@/assets/images/landing/pastry.avif";
import soup from "@/assets/images/landing/soup.avif";
import gourmet from "@/assets/images/landing/gourmet.avif";
import salad from "@/assets/images/landing/salad.avif";

type Category = {
  name: string;
  image: string;
};

const categories: Category[] = [
  { name: "Sweets", image: sweets },
  { name: "Gourmet", image: gourmet },
  { name: "Pasty", image: pastry },
  { name: "Soups", image: soup },
];

export const Route = createFileRoute("/_public/_main/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: "NeoChef - Smart Recipe Recommendations" },
      {
        name: "description",
        content:
          "NeoChef is your personal AI-powered chef. Discover smart recipe recommendations and find culinary inspiration tailored to your taste.",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <main className="space-y-24 sm:space-y-28 md:space-y-32 lg:space-y-36 xl:space-y-40 py-16 2xl:py-28">
      <Hero />
      <Categories />
    </main>
  );
}

function Hero() {
  return (
    <section className="container grid items-center lg:grid-cols-2 mx-auto gap-10 xl:gap-12">
      <div className="flex flex-col gap-6 sm:gap-7">
        <div>
          <Badge className="flex lg:inline-flex mx-auto text-xs sm:text-sm font-medium px-4 py-1.5 text-secondary-foreground bg-secondary border shadow-md rounded-full mb-3.5">
            <ChefHat /> Smart Cooking
          </Badge>
          <h1 className="text-center lg:text-left text-4xl sm:text-5xl xl:text-6xl font-bold bg-linear-to-r from-primary via-foreground/80 to-foreground/70 tracking-tight text-transparent bg-clip-text">
            Your Personal{" "}
            <span className="font-medium italic mr-2 sm:mr-0">AI Chef</span>{" "}
            <br />
            Ready to Cook
          </h1>
        </div>
        <p className="text-center lg:text-left mx-auto lg:mx-0 text-base sm:text-lg xl:text-xl 2xl:text-2xl font-normal text-muted-foreground  max-w-md sm:max-w-lg  lg:max-w-150">
          We can find delicious recipes, smart meal plans, and culinary
          inspiration — tailored exactly to your taste 🍲.
        </p>
        <div className="flex gap-4 sm:gap-7 justify-center lg:justify-start">
          <Button
            className="text-base lg:text-lg shadow-md h-11 rounded-md px-5 sm:px-8"
            asChild
          >
            <Link to="/register">🚀 Get Started</Link>
          </Button>
          <Button
            className="text-base lg:text-lg shadow-md h-11 rounded-md px-5 sm:px-8 "
            asChild
            variant="outline"
          >
            <Link to="/about">🔎 Learn More</Link>
          </Button>
        </div>
        <div className=" flex justify-center lg:justify-start flex-wrap gap-y-2 gap-x-7 text-muted-foreground">
          <div className="text-sm sm:text-base flex gap-2 text-nowrap">
            <Check color="green" />
            AI Powered Recipes 🤖
          </div>
          <div className="text-sm sm:text-base flex gap-2 text-nowrap">
            <Check color="green" />
            Smart Meal Planning 📅
          </div>
          <div className="text-sm sm:text-base flex gap-2 text-nowrap">
            <Check color="green" />
            Personalized For You ✨
          </div>
        </div>
      </div>

      <div className="hidden lg:flex relative w-full flex-col justify-between aspect-4/3 2xl:aspect-3/2 max-w-2xl my-auto place-self-end overflow-hidden border shadow-xl/20 rounded-2xl">
        <Image
          src={salad}
          alt="Vitamin Bomb"
          className="absolute"
          fetchPriority="high"
        />
        <div className="z-10 flex items-center justify-between p-3 font-mono border-b bg-background bg-opacity-80">
          <p>🥗 Vitamin Bomb</p>
          <p>❤️ 423</p>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <div className="w-full">
      <section className="container mx-auto">
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 items-center text-center">
          <Badge className="text-xs sm:text-sm font-medium px-4 py-1.5 text-secondary-foreground bg-secondary border shadow-md rounded-full">
            <ChefHat /> Food Categories
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl py-1 font-bold tracking-tight text-primary">
            Something for everybody
          </h2>
          <p className="text-base sm:text-xl lg:text-2xl text-muted-foreground max-w-sm sm:max-w-lg lg:max-w-4xl">
            From quick snacks to gourmet meals, find the perfect recipe for any
            moment.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 justify-items-center-safe mx-auto py-14 sm:py-16 px-10 gap-10 max-lg:max-w-xl">
          {categories.map((categorie, index) => {
            return (
              <div className="flex flex-col gap-5" key={index}>
                <Image
                  loading="lazy"
                  alt={categorie.name}
                  src={categorie.image}
                  className="w-48 xl:w-52 2xl:w-64 aspect-square rounded-xl shadow-lg"
                />
                <h2 className="text-xl xl:text-2xl font-semibold px-2 mx-auto">
                  {categorie.name}
                </h2>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
