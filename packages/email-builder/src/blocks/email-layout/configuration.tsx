"use client";

import {
  ColorInput,
  ConfigurationProps,
  FontFamilyInput,
  SliderInput,
  TextInput,
} from "@vivid/builder";
import { SquareRoundCorner } from "lucide-react";
import { FONT_FAMILIES } from "../../style-inputs/helpers/font-family";
import { EmailLayoutProps } from "./schema";

export const EmailLayoutConfiguration = ({
  data,
  setData,
}: ConfigurationProps<EmailLayoutProps>) => {
  const updateData = (d: unknown) => setData(d as EmailLayoutProps);

  return (
    <>
      <ColorInput
        label="Backdrop color"
        defaultValue={data.backdropColor ?? "#F5F5F5"}
        onChange={(backdropColor) => updateData({ ...data, backdropColor })}
      />
      <ColorInput
        label="Canvas color"
        defaultValue={data.canvasColor ?? "#FFFFFF"}
        onChange={(canvasColor) => updateData({ ...data, canvasColor })}
      />
      <ColorInput
        nullable
        label="Canvas border color"
        defaultValue={data.borderColor ?? null}
        onChange={(borderColor) => updateData({ ...data, borderColor })}
      />
      <SliderInput
        iconLabel={<SquareRoundCorner />}
        units="px"
        step={4}
        min={0}
        max={48}
        label="Canvas border radius"
        defaultValue={data.borderRadius ?? 0}
        onChange={(borderRadius) => updateData({ ...data, borderRadius })}
      />
      <FontFamilyInput
        defaultValue={data.fontFamily ?? null}
        onChange={(fontFamily) => updateData({ ...data, fontFamily })}
        fonts={FONT_FAMILIES.map((font) => ({
          cssValue: font.value,
          name: font.label,
          value: font.key,
        }))}
      />
      <ColorInput
        label="Text color"
        defaultValue={data.textColor ?? "#262626"}
        onChange={(textColor) => updateData({ ...data, textColor })}
      />
      <TextInput
        label="Preview text"
        defaultValue={data.previewText || ""}
        rows={5}
        onChange={(previewText) => updateData({ ...data, previewText })}
      />
    </>
  );
};
