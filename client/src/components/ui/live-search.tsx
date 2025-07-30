import { useDebounce } from "@/hooks/useDebounce";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export type LiveSearchProps<T> = {
  getQueryOptions: (
    query: string
  ) => ReturnType<
    typeof queryOptions<T[], Error, T[], (string | { query: string })[]>
  >;
  inputPlaceholder?: string;
  debounceDelay?: number;
  minQueryLength?: number;
  getResultKey: (item: T) => string;
  renderResultItem: (item: T) => React.ReactNode;
  onSelectItem?: (item: T) => void;
  renderPendingResult: React.ReactNode;
} & Omit<React.ComponentProps<typeof Command>, "onSelect">;

export function LiveSearch<T>({
  getQueryOptions,
  renderResultItem,
  renderPendingResult,
  debounceDelay = 300,
  inputPlaceholder = "Search...",
  getResultKey,
  minQueryLength = 2,
  onSelectItem,
  className,
  ...props
}: LiveSearchProps<T>) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, debounceDelay);

  const { data, isLoading } = useQuery({
    ...getQueryOptions(debouncedQuery),
    enabled: debouncedQuery.length >= minQueryLength,
  });

  return (
    <Command className={cn("p-1", className)} {...props}>
      <Input
        className="mb-2"
        placeholder={inputPlaceholder}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isLoading ? (
        renderPendingResult
      ) : (
        <CommandList className="max-h-44">
          <CommandEmpty className="h-[168px] mx-auto max-w-52 text-center flex flex-col gap-1 justify-center items-center">
            No results found.{" "}
            <span className="text-muted-foreground text-xs">
              Term has to be at least 2 characters. Try a different search term.
            </span>
          </CommandEmpty>
          <CommandGroup>
            {data?.map((item) => (
              <CommandItem
                key={getResultKey(item)}
                onSelect={() => onSelectItem?.(item)}
              >
                {renderResultItem(item)}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
}
