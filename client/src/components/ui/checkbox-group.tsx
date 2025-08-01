import React from "react";
import { cn } from "@/lib/utils";
import { Checkbox, checkboxVariants } from "./checkbox";
import type { VariantProps } from "class-variance-authority";

export type CheckboxGroupProps<T> = {
  options: T[];
  value: T[];
  onValueChange: (value: T[]) => void;
  getKey: (option: T) => string;
  getLabel?: (option: T) => string;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof checkboxVariants>;

export function CheckboxGroup<T>({
  size,
  options,
  value,
  onValueChange,
  getKey,
  getLabel = (option) => getKey(option),
  className,
  ...props
}: CheckboxGroupProps<T>) {
  return (
    <div className={cn(`w-full`, className)} {...props}>
      {options.map((option) => {
        const key = getKey(option);
        const checked = value.some((d) => getKey(d) === key);

        function handleCheckedChange(checked: boolean) {
          if (checked) {
            onValueChange(value.filter((d) => getKey(d) !== key));
          } else {
            onValueChange([...value, option]);
          }
        }

        return (
          <div className="flex items-center gap-2.5" key={key}>
            <Checkbox
              size={size}
              id={`checkbox-group-${key}`}
              checked={checked}
              onCheckedChange={handleCheckedChange}
              label={getLabel(option)}
            />
          </div>
        );
      })}
    </div>
  );
}
