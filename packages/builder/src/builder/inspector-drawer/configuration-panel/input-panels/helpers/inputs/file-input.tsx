import React from "react";

import { AssetSelectorInput, FormDescription, Label } from "@vivid/ui";
import { ResetButton } from "./reset-button";

type Props = {
  label: string;
  accept?: string;
  helperText?: string | React.JSX.Element;
  placeholder?: string;
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

export const FileInput: React.FC<Props> = ({
  helperText,
  label,
  accept,
  placeholder,
  defaultValue,
  onChange,
  nullable,
}) => {
  const [value, setValue] = React.useState(defaultValue);
  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, setValue]);

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
