import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChefHat } from "lucide-react";
// import sweets from "@/assets/pexels-polina-tankilevitch-4109792.jpg";
// import pizza from "@/assets/pexels-cottonbro-3944312.jpg";
// import pastry from "@/assets/pexels-karolina-grabowska-4197905.jpg";
// import soup from "@/assets/pexels-polina-tankilevitch-5419047.jpg";

// type Category = {
//   name: string;
//   image: string;
// };

// const categories: Category[] = [
//   { name: "Sweets", image: sweets },
//   { name: "Pizza", image: pizza },
//   { name: "Pasty", image: pastry },
//   { name: "Soups", image: soup },
// ];

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center mx-9">
      <Header />
      <main className="flex-1 w-full">
        <Hero />
        <Categories />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-transparent">
      <nav className="container flex my-5 px-3 mx-auto justify-between items-center">
        <Link
          to="/"
          className="text-primary flex items-center text-base gap-2 font-bold"
        >
          <ChefHat className="size-6" />
          NeoChef
        </Link>
        <div className="flex items-center gap-10">
          <Link
            to="/about"
            className="text-primary font-semibold border-b-2 border-transparent hover:border-primary transition-all duration-300 ease-in-out"
          >
            Our story
          </Link>
          <Link
            to="/"
            className="text-primary font-semibold border-b-2 border-transparent hover:border-primary transition-all duration-300 ease-in-out"
          >
            Contact us
          </Link>
          <Button className="text-base shadow-md" asChild>
            <Link to="/login">
              Login <ArrowRight />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="container grid items-center xl:grid-cols-2 py-16 2xl:py-28 p-3 mx-auto gap-12">
      <div className="flex flex-col gap-7">
        <div>
          <Badge className="text-sm font-medium px-4 py-1.5 text-secondary-foreground bg-secondary border shadow-md rounded-full mb-3">
            <ChefHat /> Smart Cooking
          </Badge>
          <h1 className=" text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-foreground/80 to-foreground/70 tracking-tight text-transparent bg-clip-text">
            You Personal <span className="font-medium italic">AI Chef</span>,{" "}
            <br />
            Ready to Cook
          </h1>
        </div>
        <p className="text-lg lg:text-xl font-normal text-muted-foreground max-w-xl lg:max-w-2xl">
          We're your personal kitchen guide dedicated to finding delicious
          recipes, smart meal plans, and culinary inspiration — tailored exactly
          to your taste 🥗.
        </p>
        <div className="flex gap-7">
          <Button className="text-lg shadow-md" asChild size="xl">
            <Link to="/register">🚀 Get Started</Link>
          </Button>
          <Button
            className="text-lg shadow-md"
            asChild
            size="xl"
            variant="outline"
          >
            <Link to="/about">ℹ️ Learn More</Link>
          </Button>
        </div>
        <div className="flex flex-wrap gap-x-7 text-muted-foreground">
          <div className="flex gap-2 text-nowrap">
            <Check color="green" />
            AI Powered Recipes 🤖
          </div>
          <div className="flex gap-2 text-nowrap">
            <Check color="green" />
            Smart Meal Planning 📅
          </div>
          <div className="flex gap-2 text-nowrap">
            <Check color="green" />
            Personalized For You ✨
          </div>
        </div>
      </div>

      <div className="hidden xl:flex flex-col justify-between aspect-4/3 2xl:aspect-3/2 w-full max-w-2xl my-auto place-self-end overflow-hidden border shadow-xl/20 rounded-2xl bg-cover bg-center bg-[url(/home/pavle/NeoChef/client/src/assets/images/landing/pexels-solliefoto-299348.jpg)]">
        <div className="flex items-center justify-between p-3 font-mono border-b bg-background">
          <p>🥩 Ribeay Steak</p>
          <p>❤️ 423</p>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <div className=" w-full">
      <section className="container mx-auto py-20 ">
        <div className="flex flex-col gap-3 items-center text-center">
          <Badge className="text-sm font-medium px-4 py-1.5 text-secondary-foreground bg-secondary border shadow-md rounded-full">
            <ChefHat /> Food Categories
          </Badge>
          <h2 className="text-4xl lg:text-5xl py-1 font-bold tracking-tight text-transparent from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text">
            Something for everybody
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground">
            From quick snacks to gourmet meals, find the perfect recipe for any
            moment.
          </p>
        </div>
        <div className="grid lg:grid-cols-4 grid-cols-2 justify-items-center-safe mx-auto p-10 gap-10 max-lg:max-w-xl">
          {/* {categories.map((categorie) => {
            return (
              <div className="flex flex-col gap-4">
                <img
                  src={categorie.image}
                  className="object-cover object-center max-w-48 lg:max-w-52 xl:max-w-64 aspect-square rounded-xl overflow-clip shadow-xl"
                />
                <h2 className="text-2xl font-semibold px-2">
                  {categorie.name}
                </h2>
              </div>
            );
          })} */}
        </div>
      </section>
    </div>
  );
}

// import { createFileRoute } from "@tanstack/react-router";
// import { AnimatedFoodBackground } from "@/components/ui/animated-food-background";
// import { useAnimatedFoodItems } from "@/hooks/useAnimatedFoodItems";
// import { Button } from "@/components/ui/button";
// import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";
// import { Link } from "@tanstack/react-router";

// export const Route = createFileRoute("/")({
//   component: Welcome,
// });

// const FOOD_LAUNCH_INTERVAL = 1000;
// const FOOD_ANIMATION_DURATION = 3700;

// function Welcome() {
//   const { animatedItems } = useAnimatedFoodItems({
//     launchInterval: FOOD_LAUNCH_INTERVAL,
//     animationDuration: FOOD_ANIMATION_DURATION,
//   });

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-stone-100 to-background/90">
//       <AnimatedFoodBackground animatedItems={animatedItems} />
//       <WelcomeHero />
//     </div>
//   );
// }

// function WelcomeHero() {
//   return (
//     <div className="absolute inset-0 flex items-center justify-center z-10 mx-6 sm:mx-10">
//       <HeroCard>
//         <WelcomeContent />
//         <ActionButtons />
//         <FeatureHighlights />
//       </HeroCard>
//     </div>
//   );
// }

// function HeroCard({ children }: { children: React.ReactNode }) {
//   const { isVisible } = useEntranceAnimation(100);

//   return (
//     <div
//       className={`max-w-3xl mx-auto bg-secondary/20 backdrop-blur-md border-2 border-white/30
//       p-10 md:p-12 rounded-2xl shadow-2xl ring-2 ring-white/20
//       transition-all duration-700 ease-out relative overflow-hidden
//       ${
//         isVisible
//           ? "opacity-100 translate-y-0 scale-100"
//           : "opacity-0 translate-y-8 scale-95"
//       }`}
//     >
//       <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
//       <div className="space-y-4 md:space-y-6 text-center">{children}</div>
//     </div>
//   );
// }

// function WelcomeContent() {
//   return (
//     <>
//       <h1
//         className="text-5xl md:text-6xl font-black pt-1 text-primary tracking-tight animate-fade-in-up"
//         style={{ animationDelay: "300ms" }}
//       >
//         Welcome to NeoChef
//       </h1>

//       <p
//         className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto md:mx-10 animate-fade-in-up"
//         style={{ animationDelay: "500ms" }}
//       >
//         Your personal AI-powered culinary assistant that helps you discover,
//         create and thoroughly enjoy amazing recipes tailored to your taste
//       </p>
//     </>
//   );
// }

// function ActionButtons() {
//   return (
//     <div
//       className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up"
//       style={{ animationDelay: "700ms" }}
//     >
//       <Button
//         asChild
//         size="lg"
//         className="text-lg pl-8 flex items-center gap-2 transition-all duration-300 hover:scale-105"
//       >
//         <Link to="/register">
//           Get Started
//           <span role="img" aria-label="Rocket" className="text-xl">
//             🚀
//           </span>
//         </Link>
//       </Button>
//       <Button
//         asChild
//         variant="outline"
//         size="lg"
//         className="text-lg pl-8 flex items-center gap-2 transition-all duration-300 hover:scale-105"
//       >
//         <Link to="/about">
//           Learn More
//           <span role="img" aria-label="Information" className="text-xl">
//             ℹ️
//           </span>
//         </Link>
//       </Button>
//     </div>
//   );
// }

// function FeatureHighlights() {
//   return (
//     <div
//       className="text-sm md:text-lg text-muted-foreground pt-4 animate-fade-in-up"
//       style={{ animationDelay: "900ms" }}
//     >
//       AI cooking companion • Personalized recipes • Smart meal planning
//     </div>
//   );
// }
