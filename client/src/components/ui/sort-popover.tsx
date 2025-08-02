import { type RecipeSortOptions } from "@common/schemas/recipe";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { ArrowUpDown } from "lucide-react";

type SortOptionsPopoverProps = {
  onValueChange: (value: RecipeSortOptions) => void;
  value: RecipeSortOptions;
};

const SORT_OPTIONS: ({ label: string } & RecipeSortOptions)[] = [
  { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Most Liked", sortBy: "likeCount", sortOrder: "desc" },
  { label: "Healthiest", sortBy: "healthScore", sortOrder: "desc" },
  { label: "Quickest", sortBy: "readyInMinutes", sortOrder: "asc" },
  { label: "Lowest Calories", sortBy: "caloriesPerServing", sortOrder: "asc" },
  {
    label: "Highest Calories",
    sortBy: "caloriesPerServing",
    sortOrder: "desc",
  },
];

export function SortOptionsPopover({
  onValueChange,
  value,
}: SortOptionsPopoverProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-normal">
          <ArrowUpDown strokeWidth={2.5} />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuRadioGroup
          value={JSON.stringify(value)}
          onValueChange={(val) => {
            onValueChange(JSON.parse(val) as RecipeSortOptions);
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              key={`${option.sortBy}-${option.sortOrder}`}
              value={JSON.stringify({
                sortBy: option.sortBy,
                sortOrder: option.sortOrder,
              })}
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
