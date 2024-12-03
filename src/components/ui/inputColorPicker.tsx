"use client";

import { ControllerRenderProps } from "react-hook-form";
import { ColorChangeHandler, SketchPicker } from "react-color";
import {
  InputGroupInputClasses,
  InputGroupSuffixClasses,
} from "../admin/forms/inputGroupClasses";
import { Button } from "./button";
import { Input } from "./input";
import { InputGroup, InputGroupInput } from "./inputGroup";
import React from "react";
import { Palette } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type InputColorPickerProps = {
  field: ControllerRenderProps<any>;
  disabled?: boolean;
  placeholder?: string;
};

export const InputColorPicker: React.FC<InputColorPickerProps> = ({
  field,
  placeholder,
  disabled,
}) => {
  const onColorChange: ColorChangeHandler = (color) => {
    const newValue =
      (color.rgb.a ?? 1) === 1
        ? color.hex
        : `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;

    field.onChange(newValue);
  };

  return (
    <InputGroup>
      <InputGroupInput>
        <Input
          disabled={disabled}
          placeholder={placeholder}
          className={InputGroupInputClasses()}
          {...field}
        />
      </InputGroupInput>
      <Popover onOpenChange={(open) => !open && field.onBlur()}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={InputGroupSuffixClasses()}
          >
            <Palette size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-transparent border-none shadow-none w-fit">
          <SketchPicker color={field.value} onChangeComplete={onColorChange} />
        </PopoverContent>
      </Popover>
    </InputGroup>
  );
};
