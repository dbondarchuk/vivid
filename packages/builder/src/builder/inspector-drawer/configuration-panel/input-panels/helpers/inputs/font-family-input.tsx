import React from "react";

import { SelectInput } from "./select-input";

type Props = {
  defaultValue: string | null;
  onChange: (v: string | null) => void;
  fonts: { name: string; value: string; cssValue: string }[];
};

export const FontFamilyInput: React.FC<Props> = ({
  onChange,
  defaultValue,
  fonts,
}) => {
  return (
    <SelectInput
      nullable
      defaultValue={defaultValue}
      onChange={onChange}
      label="Font family"
      placeholder="Select font"
      options={fonts.map((font) => ({
        label: font.name,
        value: font.value,
        style: {
          fontFamily: font.cssValue,
        },
      }))}
    />
  );
};
