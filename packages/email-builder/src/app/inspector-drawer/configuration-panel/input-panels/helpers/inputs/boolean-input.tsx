import { Switch, Label } from "@vivid/ui";
import React, { useState } from "react";

type Props = {
  label: string;
  defaultValue: boolean;
  onChange: (value: boolean) => void;
};

export default function BooleanInput({ label, defaultValue, onChange }: Props) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex w-full">
        <Switch
          checked={value}
          onCheckedChange={(checked) => {
            setValue(checked);
            onChange(checked);
          }}
        />
      </div>
    </div>
  );
}
