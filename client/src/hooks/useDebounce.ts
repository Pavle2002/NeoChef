import { useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const handler = useRef<number | null>(null);

  useEffect(() => {
    if (handler.current !== null) {
      clearTimeout(handler.current);
    }

    handler.current = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (handler.current !== null) {
        clearTimeout(handler.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
