import React, { useState } from "react";

import RadioGroupInput from "./radio-group-input";
import { Label, RadioGroupItem } from "@vivid/ui";
import { RadioGroupInputItem } from "./radio-group-input-item";

type Props = {
  label: string;
  defaultValue: string;
  onChange: (value: string) => void;
};
export default function FontWeightInput({
  label,
  defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  return (
    <RadioGroupInput
      label={label}
      defaultValue={value}
      onChange={(fontWeight) => {
        setValue(fontWeight);
        onChange(fontWeight);
      }}
    >
      <RadioGroupInputItem value="normal">Regular</RadioGroupInputItem>
      <RadioGroupInputItem value="bold">Bold</RadioGroupInputItem>
    </RadioGroupInput>
  );
}
