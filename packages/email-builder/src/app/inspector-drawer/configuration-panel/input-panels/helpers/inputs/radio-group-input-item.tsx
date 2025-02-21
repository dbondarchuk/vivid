import {
  buttonVariants,
  cn,
  Label,
  RadioButtonGroupItem,
  RadioGroupItem,
} from "@vivid/ui";
import React from "react";

export type RadioGroupInputItemProps = {
  value: string;
  children: React.ReactNode | React.ReactNode[];
};

export const RadioGroupInputItem: React.FC<RadioGroupInputItemProps> = ({
  value,
  children,
}) => {
  const id = React.useId();
  return (
    <div className="inline-flex items-center space-x-2" key={value}>
      <RadioButtonGroupItem value={value} id={value}>
        {children}
      </RadioButtonGroupItem>
      {/* <Label htmlFor={value} className="inline-flex items-center gap-1"> */}
      {/* <Label
        htmlFor={id}
        className={cn(buttonVariants({ variant: "ghost" }), "cursor-pointer")}
      >
        {children}
      </Label> */}
    </div>
  );
};
