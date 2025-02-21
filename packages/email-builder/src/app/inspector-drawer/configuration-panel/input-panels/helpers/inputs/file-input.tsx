import React, { JSX, useState } from "react";

import {
  FormItem,
  FormLabel,
  FormControl,
  Textarea,
  Input,
  FormDescription,
  Label,
  AssetSelectorInput,
} from "@vivid/ui";

type Props = {
  label: string;
  accept?: string;
  helperText?: string | JSX.Element;
  defaultValue: string;
  placeholder?: string;
  onChange: (v: string) => void;
};

export default function FileInput({
  helperText,
  label,
  accept,
  placeholder,
  defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex w-full">
        <AssetSelectorInput
          className="w-full"
          accept={accept}
          placeholder={placeholder}
          value={value}
          fullUrl
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
