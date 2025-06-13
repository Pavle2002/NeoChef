import { useEffect, useState } from "react";

/**
 * Custom hook to handle component entrance animations
 * @param delay - Delay in milliseconds before starting the animation (default: 100ms)
 * @returns Object containing visibility state
 */
export function useEntranceAnimation(delay = 100) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure animation starts after component mount
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return { isVisible };
}
