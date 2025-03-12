"use client";

import React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { SketchProps, Sketch } from "@uiw/react-color";
import { InputGroupInputClasses, InputGroupSuffixClasses } from "./input-group";
import { Button } from "./button";
import { Input, InputProps } from "./input";
import { InputGroup, InputGroupInput } from "./input-group";
import { Palette } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../utils";

export type ColorPickerInputProps = Omit<
  InputProps,
  "value" | "onChange" | "onBlur"
> & {
  enableAlpha?: boolean;
  value?: string;
  onChange?: (value?: string) => void;
  onBlur?: () => void;
};

export const ColorPickerInput: React.FC<ColorPickerInputProps> = ({
  value,
  onChange,
  disabled,
  enableAlpha,
  ...props
}) => {
  const onColorChange: SketchProps["onChange"] = (color) => {
    const newValue =
      (color.rgba.a ?? 1) === 1
        ? color.hex
        : `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`;

    onChange?.(newValue);
  };

  return (
    <InputGroup>
      <div
        className={cn(
          InputGroupSuffixClasses({ variant: "prefix" }),
          "w-9 h-9",
          "transition-colors"
        )}
        style={{ backgroundColor: value }}
      ></div>
      <InputGroupInput>
        <Input
          disabled={disabled}
          className={cn(
            InputGroupInputClasses({ variant: "prefix" }),
            InputGroupInputClasses({ variant: "suffix" })
          )}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        />
      </InputGroupInput>
      <Popover onOpenChange={(open) => !open && props.onBlur?.()}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            className={InputGroupSuffixClasses()}
          >
            <Palette size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-transparent border-none shadow-none w-fit">
          <Sketch
            color={value}
            onChange={onColorChange}
            disableAlpha={!enableAlpha}
          />
        </PopoverContent>
      </Popover>
    </InputGroup>
  );
};
