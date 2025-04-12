import React, { ReactNode } from "react";

import {
  cn,
  Input,
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
  InputSuffix,
  Label,
} from "@vivid/ui";
import { ResetButton } from "./reset-button";

type TextDoubleNumberInputProps = {
  label: string;
  unit?: string;
  x?: ReactNode;
  prefix1?: ReactNode;
  prefix2?: ReactNode;
} & (
  | {
      defaultValue1: number;
      onChange1: (v: number) => void;
      defaultValue2: number;
      onChange2: (v: number) => void;
      nullable?: false;
    }
  | {
      defaultValue1: number | null;
      onChange1: (v: number | null) => void;
      defaultValue2: number | null;
      onChange2: (v: number | null) => void;
      nullable: true;
    }
);

export const TextDoubleNumberInput: React.FC<TextDoubleNumberInputProps> = ({
  label,
  defaultValue1,
  onChange1,
  defaultValue2,
  onChange2,
  nullable,
  prefix1,
  prefix2,
  unit = "px",
  x,
}) => {
  const handleChange = (val: string | null, right: boolean) => {
    const value = parseInt(val ?? "");
    if (nullable) {
      (right ? onChange2 : onChange1)(isNaN(value) ? null : value);
    } else {
      (right ? onChange2 : onChange1)(isNaN(value) ? 0 : value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex w-full flex-row gap-2 flex-wrap items-center justify-center">
        <InputGroup>
          {prefix1 && (
            <InputSuffix
              className={InputGroupSuffixClasses({ variant: "prefix" })}
            >
              {prefix1}
            </InputSuffix>
          )}
          <InputGroupInput>
            <Input
              type="number"
              className={cn(
                "min-w-20",
                InputGroupInputClasses(),
                prefix1 && InputGroupInputClasses({ variant: "prefix" })
              )}
              value={defaultValue1?.toString() || ""}
              onChange={(e) => handleChange(e.target.value, false)}
            />
          </InputGroupInput>
          <InputSuffix className={InputGroupSuffixClasses()}>
            {unit}
          </InputSuffix>
          {nullable && (
            <ResetButton
              onClick={() => {
                handleChange(null, false);
              }}
            />
          )}
        </InputGroup>
        {x}
        <InputGroup>
          {prefix2 && (
            <InputSuffix
              className={InputGroupSuffixClasses({ variant: "prefix" })}
            >
              {prefix2}
            </InputSuffix>
          )}
          <InputGroupInput>
            <Input
              type="number"
              className={cn(
                "min-w-20",
                InputGroupInputClasses(),
                prefix2 && InputGroupInputClasses({ variant: "prefix" })
              )}
              value={defaultValue2?.toString() || ""}
              onChange={(e) => handleChange(e.target.value, true)}
            />
          </InputGroupInput>
          <InputSuffix className={InputGroupSuffixClasses()}>
            {unit}
          </InputSuffix>
          {nullable && (
            <ResetButton
              onClick={() => {
                handleChange(null, true);
              }}
            />
          )}
        </InputGroup>
      </div>
    </div>
  );
};
