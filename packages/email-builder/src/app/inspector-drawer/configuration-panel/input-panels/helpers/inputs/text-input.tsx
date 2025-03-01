import React, { JSX, useState } from "react";

import {
  FormItem,
  FormLabel,
  FormControl,
  Textarea,
  Input,
  FormDescription,
  Label,
  ArgumentsAutocomplete,
  cn,
} from "@vivid/ui";
import { useEditorArgs } from "../../../../../../documents/editor/context";

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
  const args = useEditorArgs();
  const isMultiline = typeof rows === "number" && rows > 1;
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex w-full">
        <ArgumentsAutocomplete
          args={args}
          asInput={!isMultiline}
          className={cn("w-full", isMultiline && "max-h-40")}
          autoResize
          placeholder={placeholder}
          value={value}
          onChange={(v) => {
            setValue(v);
            onChange(v);
          }}
        />
      </div>
      {helperText && <FormDescription>{helperText}</FormDescription>}
    </div>
  );
}
