import { Button } from "@/components/ui/button";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";
import { Link } from "@tanstack/react-router";

export function WelcomeHero() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 mx-6 sm:mx-10">
      <HeroCard>
        <WelcomeContent />
        <ActionButtons />
        <FeatureHighlights />
      </HeroCard>
    </div>
  );
}

function HeroCard({ children }: { children: React.ReactNode }) {
  const { isVisible } = useEntranceAnimation(100);

  return (
    <div
      className={`max-w-3xl mx-auto bg-secondary/20 backdrop-blur-md border-2 border-white/30 
      p-10 md:p-12 rounded-2xl shadow-2xl ring-2 ring-white/20
      transition-all duration-700 ease-out relative overflow-hidden
      ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="space-y-4 md:space-y-6 text-center">{children}</div>
    </div>
  );
}

function WelcomeContent() {
  return (
    <>
      <h1
        className="text-5xl md:text-6xl font-black pt-1 text-primary tracking-tight animate-fade-in-up"
        style={{ animationDelay: "300ms" }}
      >
        Welcome to NeoChef
      </h1>

      <p
        className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto md:mx-10 animate-fade-in-up"
        style={{ animationDelay: "500ms" }}
      >
        Your personal AI-powered culinary assistant that helps you discover,
        create and thoroughly enjoy amazing recipes tailored to your taste
      </p>
    </>
  );
}

function ActionButtons() {
  return (
    <div
      className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up"
      style={{ animationDelay: "700ms" }}
    >
      <Button
        asChild
        size="lg"
        className="text-lg pl-8 flex items-center gap-2 transition-all duration-300 hover:scale-105"
      >
        <Link to="/register">
          Get Started
          <span role="img" aria-label="Rocket" className="text-xl">
            🚀
          </span>
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="text-lg pl-8 flex items-center gap-2 transition-all duration-300 hover:scale-105"
      >
        <Link to="/about">
          Learn More
          <span role="img" aria-label="Information" className="text-xl">
            ℹ️
          </span>
        </Link>
      </Button>
    </div>
  );
}

function FeatureHighlights() {
  return (
    <div
      className="text-sm md:text-lg text-muted-foreground pt-4 animate-fade-in-up"
      style={{ animationDelay: "900ms" }}
    >
      AI cooking companion • Personalized recipes • Smart meal planning
    </div>
  );
}
