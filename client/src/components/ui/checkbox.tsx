import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { cva, type VariantProps } from "class-variance-authority";

const checkboxVariants = cva(
  "font-normal px-4 py-2 text-primary/90 rounded-md border border-primary/15 transition-colors duration-150 peer-checked:font-medium peer-checked:border-primary peer-checked:bg-secondary peer-checked:text-primary cursor-pointer hover:bg-accent/80 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:ring-offset-2",
  {
    variants: {
      size: {
        xs: "text-xs px-2 py-1 rounded-sm",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

type CheckboxProps = {
  label: string;
  onCheckedChange: (checked: boolean) => void;
  checked: boolean;
} & VariantProps<typeof checkboxVariants> &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange" | "checked"
  >;

function Checkbox({
  label,
  onCheckedChange,
  className,
  checked,
  id,
  size,
  ...props
}: CheckboxProps) {
  return (
    <>
      <input
        type="checkbox"
        id={id}
        className="peer sr-only"
        tabIndex={-1}
        checked={checked}
        onChange={() => onCheckedChange(checked)}
        {...props}
      />
      <Label
        className={cn(checkboxVariants({ size }), className)}
        htmlFor={id}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onCheckedChange(checked);
          }
        }}
      >
        {label}
      </Label>
    </>
  );
}

export { Checkbox, checkboxVariants };
