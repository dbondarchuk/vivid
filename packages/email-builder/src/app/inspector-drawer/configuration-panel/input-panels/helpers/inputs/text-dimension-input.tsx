import React from "react";

import {
  FormControl,
  FormItem,
  FormLabel,
  Input,
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
  InputSuffix,
  Label,
} from "@vivid/ui";

type TextDimensionInputProps = {
  label: string;
  defaultValue: number | null | undefined;
  onChange: (v: number | null) => void;
};
export default function TextDimensionInput({
  label,
  defaultValue,
  onChange,
}: TextDimensionInputProps) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const value = parseInt(ev.target.value);
    onChange(isNaN(value) ? null : value);
  };
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex w-full">
        <InputGroup>
          <InputGroupInput>
            <Input
              type="number"
              className={InputGroupInputClasses()}
              defaultValue={defaultValue?.toString()}
              onChange={(e) => handleChange(e)}
            />
          </InputGroupInput>
          <InputSuffix className={InputGroupSuffixClasses()}>px</InputSuffix>
        </InputGroup>
      </div>
    </div>
  );
}
