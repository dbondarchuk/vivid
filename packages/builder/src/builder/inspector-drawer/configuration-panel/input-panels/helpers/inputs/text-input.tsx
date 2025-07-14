import { JSX } from "react";

import { ArgumentsAutocomplete, cn, FormDescription, Label } from "@vivid/ui";
import React from "react";
import { useEditorArgs } from "../../../../../../documents/editor/context";
import { ResetButton } from "./reset-button";

type Props = {
  label: string;
  rows?: number;
  placeholder?: string;
  helperText?: string | JSX.Element;
} & (
  | {
      defaultValue: string;
      onChange: (v: string) => void;
      nullable?: false;
    }
  | {
      defaultValue: string | null;
      onChange: (v: string | null) => void;
      nullable: true;
    }
);
export const TextInput: React.FC<Props> = ({
  helperText,
  label,
  placeholder,
  rows,
  defaultValue,
  nullable,
  onChange,
}) => {
  const [value, setValue] = React.useState(defaultValue);
  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, setValue]);

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
          placeholder={placeholder}
          value={value ?? undefined}
          h="sm"
          onChange={(v) => {
            setValue(v);
            onChange(v);
          }}
        />
        {nullable && (
          <ResetButton
            onClick={() => {
              setValue(null);
              onChange(null);
            }}
          />
        )}
      </div>
      {helperText && <FormDescription>{helperText}</FormDescription>}
    </div>
  );
};
