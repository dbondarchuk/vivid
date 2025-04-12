import { RadioButtonGroupItem } from "@vivid/ui";
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
    </div>
  );
};
