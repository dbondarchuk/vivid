import React from "react";

import { TStyle } from "./helpers/TStyle";
import { DraftingCompass } from "lucide-react";
import {
  ColorInput,
  FontFamilyInput,
  FontSizeInput,
  PaddingInput,
  SelectInput,
  SliderInput,
  TextAlignInput,
} from "@vivid/builder";
import { FONT_FAMILIES } from "./helpers/font-family";

type StylePropertyPanelProps = {
  name: keyof TStyle;
  value: TStyle;
  onChange: (style: TStyle) => void;
};

export const SingleStylePropertyPanel: React.FC<StylePropertyPanelProps> = ({
  name,
  value,
  onChange,
}) => {
  const defaultValue = value[name] ?? null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (v: any) => {
    onChange({ ...value, [name]: v });
  };

  switch (name) {
    case "backgroundColor":
      return (
        <ColorInput
          nullable
          label="Background color"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case "borderColor":
      return (
        <ColorInput
          nullable
          label="Border color"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case "borderRadius":
      return (
        <SliderInput
          nullable
          iconLabel={<DraftingCompass />}
          units="px"
          step={4}
          min={0}
          max={48}
          label="Border radius"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case "color":
      return (
        <ColorInput
          nullable
          label="Text color"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case "fontFamily":
      return (
        <FontFamilyInput
          defaultValue={defaultValue}
          onChange={handleChange}
          fonts={FONT_FAMILIES.map((font) => ({
            cssValue: font.value,
            name: font.label,
            value: font.key,
          }))}
        />
      );
    case "fontSize":
      return (
        <FontSizeInput
          label="Font size"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case "fontWeight":
      return (
        <SelectInput
          label="Font weight"
          defaultValue={defaultValue}
          onChange={handleChange}
          options={[
            {
              value: "normal",
              label: "Normal",
            },
            {
              value: "bold",
              label: "Bold",
            },
          ]}
        />
      );
    case "textAlign":
      return (
        <TextAlignInput
          label="Alignment"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case "padding":
      return (
        <PaddingInput
          label="Padding"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
  }
};
