import React, { JSX, useState } from "react";

import {
  FormItem,
  FormLabel,
  FormControl,
  Textarea,
  Input,
  FormDescription,
  Label,
} from "@vivid/ui";

type Props = {
  label: string;
  rows?: number;
  placeholder?: string;
  helperText?: string | JSX.Element;
  defaultValue: string;
  onChange: (v: string) => void;
};
export default function TextInput({
  helperText,
  label,
  placeholder,
  rows,
  defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const isMultiline = typeof rows === "number" && rows > 1;
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex w-full">
        {isMultiline ? (
          <Textarea
            className="w-full max-h-48"
            placeholder={placeholder}
            value={value}
            autoResize
            onChange={(ev) => {
              const v = ev.target.value;
              setValue(v);
              onChange(v);
            }}
          />
        ) : (
          <Input
            className="w-full"
            placeholder={placeholder}
            value={value}
            onChange={(ev) => {
              const v = ev.target.value;
              setValue(v);
              onChange(v);
            }}
          />
        )}
      </div>
      {helperText && <FormDescription>{helperText}</FormDescription>}
    </div>
  );
}
