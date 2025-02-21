import React, { useState } from "react";

import {
  Button,
  FormControl,
  FormItem,
  FormLabel,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@vivid/ui";
import { Plus, X } from "lucide-react";
import { SketchPicker } from "react-color";

type Props =
  | {
      nullable: true;
      label: string;
      onChange: (value: string | null) => void;
      defaultValue: string | null;
    }
  | {
      nullable: false;
      label: string;
      onChange: (value: string) => void;
      defaultValue: string;
    };

export default function ColorInput({
  label,
  defaultValue,
  onChange,
  nullable,
}: Props) {
  const [value, setValue] = useState(defaultValue);

  const renderResetButton = () => {
    if (!nullable) {
      return null;
    }

    if (typeof value !== "string" || value.trim().length === 0) {
      return null;
    }

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setValue(null);
          onChange(null);
        }}
      >
        <X size={16} />
      </Button>
    );
  };

  const renderOpenButton = () => {
    if (value) {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="border border-secondary"
          style={{ background: value }}
        />
      );
    }
    return (
      <Button
        variant="ghost"
        size="icon"
        className="bg-background border border-secondary"
      >
        <Plus size={16} />
      </Button>
    );
  };

  return (
    <div className="items-start">
      <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        <div className="flex w-full">
          <Popover>
            <div className="flex flex-row gap-1">
              <PopoverTrigger asChild>{renderOpenButton()}</PopoverTrigger>
              {renderResetButton()}
            </div>
            <PopoverContent className="bg-transparent border-none shadow-none w-fit">
              <SketchPicker
                color={value || undefined}
                onChangeComplete={(c) => {
                  setValue(c.hex);
                  onChange(c.hex);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
