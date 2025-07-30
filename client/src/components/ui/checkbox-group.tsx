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
        const checked = value.some((d) => getKey(d) === key);

        function handleCheckboxChange() {
          if (checked) {
            onValueChange(value.filter((d) => getKey(d) !== key));
          } else {
            onValueChange([...value, option]);
          }
        }

        return (
          <div className="flex items-center gap-2.5" key={key}>
            <input
              type="checkbox"
              id={`checkbox-group-${key}`}
              className="peer sr-only"
              checked={checked}
              tabIndex={-1}
              onChange={handleCheckboxChange}
            />
            {/* <Checkbox
              id={`checkbox-group-${key}`}
              checked={checked}
              onCheckedChange={(checked: boolean) => {
                if (checked) {
                  onValueChange([...value, option]);
                } else {
                  onValueChange(value.filter((d) => getKey(d) !== key));
                }
              }}
            /> */}
            <Label
              className="block w-full text-left font-normal px-4 py-2 text-primary/90 rounded-md border border-primary/15 transition-colors duration-150 peer-checked:font-medium peer-checked:border-primary peer-checked:bg-secondary peer-checked:text-primary cursor-pointer hover:bg-accent/80 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:ring-offset-2"
              htmlFor={`checkbox-group-${key}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCheckboxChange();
                }
              }}
            >
              {getLabel(option)}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
