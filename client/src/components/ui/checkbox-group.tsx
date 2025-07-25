import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type CheckboxGroupProps<T> = {
  options: T[];
  value: T[];
  onValueChange: (value: T[]) => void;
  getKey: (option: T) => string;
  getLabel?: (option: T) => string;
} & React.HTMLAttributes<HTMLDivElement>;

export function CheckboxGroup<T>({
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
        const checked = Array.isArray(value)
          ? value.some((d) => getKey(d) === key)
          : false;

        return (
          <div className="flex items-center gap-2.5" key={key}>
            <Checkbox
              id={`checkbox-group-${key}`}
              checked={checked}
              onCheckedChange={(checked: boolean) => {
                if (checked) {
                  onValueChange([...value, option]);
                } else {
                  onValueChange(value.filter((d) => getKey(d) !== key));
                }
              }}
            />
            <Label
              className="font-normal cursor-pointer"
              htmlFor={`checkbox-group-${key}`}
            >
              {getLabel(option)}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
