import { createFileRoute } from "@tanstack/react-router";
import { WelcomeHero } from "@/components/welcome/welcome-hero";
import { AnimatedFoodBackground } from "@/components/welcome/animated-food-background";
import { useAnimatedFoodItems } from "@/hooks/useAnimatedFoodItems";

export const Route = createFileRoute("/")({
  component: Welcome,
});

const FOOD_LAUNCH_INTERVAL = 1000;
const FOOD_ANIMATION_DURATION = 3700;

function Welcome() {
  const { animatedItems } = useAnimatedFoodItems({
    launchInterval: FOOD_LAUNCH_INTERVAL,
    animationDuration: FOOD_ANIMATION_DURATION,
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-stone-100 to-background/90">
      <AnimatedFoodBackground animatedItems={animatedItems} />
      <WelcomeHero />
    </div>
  );
}
