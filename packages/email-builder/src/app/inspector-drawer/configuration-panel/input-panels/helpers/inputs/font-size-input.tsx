import React, { useState } from "react";

import RawSliderInput from "./raw/raw-slider-input";
import { FormItem, FormLabel, FormControl, Label } from "@vivid/ui";
import { CaseSensitive } from "lucide-react";

type Props = {
  label: string;
  defaultValue: number;
  onChange: (v: number) => void;
};
export default function FontSizeInput({
  label,
  defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const handleChange = (value: number) => {
    setValue(value);
    onChange(value);
  };
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex w-full">
        <RawSliderInput
          iconLabel={<CaseSensitive size={16} />}
          value={value}
          setValue={handleChange}
          units="px"
          step={1}
          min={10}
          max={48}
        />
      </div>
    </div>
  );
}
