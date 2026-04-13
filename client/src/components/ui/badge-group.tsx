import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const badgeGroupVariants = cva(
  "px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      color: {
        green: "bg-green-100 text-green-800",
        blue: "bg-blue-100 text-blue-800",
        red: "bg-red-100 text-red-800",
        orange: "bg-orange-100 text-orange-800",
      },
    },
  },
);

type BadgeGroupProps = {
  items: { name: string }[];
  color: "green" | "blue" | "red" | "orange";
};

export function BadgeGroup({
  items,
  color,
  className,
}: BadgeGroupProps & React.ComponentProps<"span">) {
  return items.map((item) => (
    <span
      key={item.name}
      className={cn(badgeGroupVariants({ color, className }))}
    >
      {item.name}
    </span>
  ));
}
