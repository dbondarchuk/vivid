import React, { useState } from "react";

import RadioGroupInput from "./radio-group-input";
import { RadioGroupItem, Label } from "@vivid/ui";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { RadioGroupInputItem } from "./radio-group-input-item";

type Props = {
  label: string;
  defaultValue: string | null;
  onChange: (value: string | null) => void;
};
export default function TextAlignInput({
  label,
  defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue ?? "left");

  return (
    <RadioGroupInput
      label={label}
      defaultValue={value}
      onChange={(value) => {
        setValue(value);
        onChange(value);
      }}
    >
      <RadioGroupInputItem value="left">
        <AlignLeft /> Left
      </RadioGroupInputItem>
      <RadioGroupInputItem value="center">
        <AlignCenter /> Center
      </RadioGroupInputItem>
      <RadioGroupInputItem value="right">
        <AlignRight /> Right
      </RadioGroupInputItem>
    </RadioGroupInput>
  );
}
