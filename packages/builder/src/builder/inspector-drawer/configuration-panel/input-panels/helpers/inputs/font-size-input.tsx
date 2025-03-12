import React from "react";

import { Label } from "@vivid/ui";
import { CaseSensitive } from "lucide-react";
import RawSliderInput from "./raw/raw-slider-input";
import { ResetButton } from "./reset-button";

type Props = {
  label: string;
  defaultValue: number | null;
  onChange: (v: number | null) => void;
};

export const FontSizeInput: React.FC<Props> = ({
  label,
  defaultValue,
  onChange,
}) => {
  const [value, setValue] = React.useState(defaultValue);
  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, setValue]);

  const handleChange = (value: number | null) => {
    setValue(value);
    onChange(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex w-full">
        <RawSliderInput
          iconLabel={<CaseSensitive size={16} />}
          value={value}
          setValue={handleChange}
          units="px"
          step={1}
          min={8}
          max={48}
        />
        {/* <ResetButton onClick={handleChange} /> */}
      </div>
    </div>
  );
};
