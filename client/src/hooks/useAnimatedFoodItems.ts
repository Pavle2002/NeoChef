import { useState, useCallback, useEffect } from "react";

export const FOOD_IMAGES = [
  "apple.png",
  "banana.png",
  "eggplant.png",
  "cheese.png",
  "tomato.png",
  "carrot.png",
  "grapes.png",
  "chiken.png",
  "lemon.png",
  "pear.png",
  "onion.png",
  "orange.png",
  "raspberry.png",
  "egg.png",
  "pineapple.png",
  "steak.png",
  "peach.png",
  "muffin.png",
];

export interface AnimatedFoodItem {
  id: number;
  src: string;
  alt: string;
  side: "left" | "right";
  scale: number;
}

interface UseAnimatedFoodItemsOptions {
  launchInterval: number;
  animationDuration: number;
}

/**
 * Custom hook for managing animated food items
 * Handles the creation, animation, and removal of food items
 */
export function useAnimatedFoodItems({
  animationDuration,
  launchInterval,
}: UseAnimatedFoodItemsOptions) {
  const [animatedItems, setAnimatedItems] = useState<AnimatedFoodItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastSide, setLastSide] = useState<"left" | "right">("right");

  const launchItem = useCallback(() => {
    const image = FOOD_IMAGES[currentIndex];
    const nextSide = lastSide === "left" ? "right" : "left";
    const randomScale = 1 + Math.random();

    // Create new animated item
    const newItem: AnimatedFoodItem = {
      id: Date.now(),
      src: new URL(`../assets/images/food/${image}`, import.meta.url).href,
      alt: image.split(".")[0],
      side: nextSide,
      scale: randomScale,
    };

    // Update the last side used
    setLastSide(nextSide);

    // Update index for next item, looping back to start when we reach the end
    setCurrentIndex((prevIndex) => (prevIndex + 1) % FOOD_IMAGES.length);

    // Add the new item to the animation list
    setAnimatedItems((prevItems) => [...prevItems, newItem]);

    // Remove the item after animation completes
    setTimeout(() => {
      setAnimatedItems((prevItems) =>
        prevItems.filter((item) => item.id !== newItem.id)
      );
    }, animationDuration);
  }, [animationDuration, currentIndex, lastSide]);

  useEffect(() => {
    // Start launching animated food items at regular intervals
    const interval = setInterval(() => {
      launchItem();
    }, launchInterval);

    // Clean up interval when component unmounts
    return () => clearInterval(interval);
  }, [launchItem, launchInterval]);

  return { animatedItems };
}
