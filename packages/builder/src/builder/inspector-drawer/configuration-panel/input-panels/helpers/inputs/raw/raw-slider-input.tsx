import { Slider, Text } from "@vivid/ui";
import React, { JSX } from "react";

type SliderInputProps = {
  iconLabel: JSX.Element;

  step?: number;
  units: string;
  min?: number;
  max?: number;

  value?: number | null;
  setValue: (v: number) => void;
};

export default function RawSliderInput({
  iconLabel,
  value,
  setValue,
  units,
  ...props
}: SliderInputProps) {
  return (
    <div className="flex flex-row items-center gap-2 justify-between w-full">
      <div className="min-w-6 shrink-0">{iconLabel}</div>
      <Slider
        {...props}
        value={value ? [value] : undefined}
        onValueChange={(val) => {
          if (typeof val[0] !== "number") {
            throw new Error(
              "RawSliderInput values can only receive numeric values"
            );
          }

          setValue(val[0]);
        }}
      />
      <div className="min-w-8 text-right shrink-0">
        <Text className="font-secondary text-secondary-foreground">
          {value}
          {units}
        </Text>
      </div>
    </div>
  );
}
