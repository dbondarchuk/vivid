import { JSX, useState } from "react";

import { Label, RadioButtonGroup } from "@vivid/ui";

type Props = {
  label: string | JSX.Element;
  children: JSX.Element | JSX.Element[];
  defaultValue: string;
  onChange: (v: string) => void;
};
export default function RadioGroupInput({
  label,
  children,
  defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex w-full">
        <RadioButtonGroup
          value={value}
          onValueChange={(v) => {
            setValue(v);
            onChange(v);
          }}
        >
          {children}
        </RadioButtonGroup>
      </div>
    </div>
  );
}
