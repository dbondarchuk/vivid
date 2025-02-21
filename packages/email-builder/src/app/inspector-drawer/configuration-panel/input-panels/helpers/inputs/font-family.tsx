import React, { useState } from "react";

import { FONT_FAMILIES } from "../../../../../../documents/blocks/helpers/font-family";
import {
  FormControl,
  FormItem,
  FormLabel,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vivid/ui";

const OPTIONS = FONT_FAMILIES.map((option) => (
  <SelectItem
    key={option.key}
    value={option.key}
    style={{ fontFamily: option.value }}
  >
    {option.label}
  </SelectItem>
));

type NullableProps = {
  label: string;
  onChange: (value: null | string) => void;
  defaultValue: null | string;
};
export function NullableFontFamily({
  label,
  onChange,
  defaultValue,
}: NullableProps) {
  const [value, setValue] = useState(defaultValue ?? "inherit");
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex w-full">
        <Select
          value={value}
          onValueChange={(v) => {
            setValue(v);
            onChange(v === null ? null : v);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a font family" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="inherit">Match email settings</SelectItem>
              {OPTIONS}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
