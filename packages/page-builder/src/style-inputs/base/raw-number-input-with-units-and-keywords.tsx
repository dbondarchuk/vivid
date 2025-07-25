"use client";
import { BuilderKeys, useI18n } from "@vivid/i18n";
import { cn, Combobox } from "@vivid/ui";
import { useCallback, useMemo, useState } from "react";
import {
  NumberValueWithUnit,
  NumberValueWithUnitOrGlobalKeyword,
  NumberValueWithUnitOrKeyword,
} from "../../style/zod";
import {
  RawNumberInputWithUnit,
  RawNumberInputWithUnitsProps,
} from "./raw-number-input-with-units";
import { CSSValueOption } from "./types";

type BaseRawNumberInputWithUnitsAndKeywordsProps = Pick<
  RawNumberInputWithUnitsProps,
  "icon" | "min" | "max" | "step" | "forceUnit" | "id" | "options"
> & {
  className?: string;
};

// Type for when keywords are provided
interface RawNumberInputWithUnitsAndKeywordsPropsWithKeywords<T extends string>
  extends BaseRawNumberInputWithUnitsAndKeywordsProps {
  value: NumberValueWithUnitOrKeyword<T> | null | undefined;
  onChange: (value: NumberValueWithUnitOrKeyword<T>) => void;
  keywords: readonly CSSValueOption<T>[];
}

// Type for when keywords are not provided
interface RawNumberInputWithUnitsAndKeywordsPropsWithoutKeywords
  extends BaseRawNumberInputWithUnitsAndKeywordsProps {
  value: NumberValueWithUnitOrGlobalKeyword | null | undefined;
  onChange: (value: NumberValueWithUnitOrGlobalKeyword) => void;
  keywords?: never;
}

type RawNumberInputWithUnitsAndKeywordsProps<T extends string> =
  | RawNumberInputWithUnitsAndKeywordsPropsWithKeywords<T>
  | RawNumberInputWithUnitsAndKeywordsPropsWithoutKeywords;

// Create options list
const globalKeywords = [
  {
    value: "auto",
    label: "pageBuilder.styles.keywords.auto",
    isKeyword: false,
  },
  {
    value: "inherit",
    label: "pageBuilder.styles.keywords.inherit",
    isKeyword: false,
  },
  {
    value: "initial",
    label: "pageBuilder.styles.keywords.initial",
    isKeyword: false,
  },
  {
    value: "unset",
    label: "pageBuilder.styles.keywords.unset",
    isKeyword: false,
  },
] as const satisfies CSSValueOption<string>[];

export const RawNumberInputWithUnitsAndKeywords = <T extends string>({
  value,
  onChange,
  keywords,
  className,
  icon,
  ...rest
}: RawNumberInputWithUnitsAndKeywordsProps<T>) => {
  const hasKeywords = keywords && keywords.length > 0;

  const defaultUnit = rest.forceUnit ?? "px";

  const [isCustomValue, setIsCustomValue] = useState(() => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") {
      if (hasKeywords) {
        // Check if the value is a keyword from our options
        const isKeyword = keywords.some((option) => option.value === value);
        return !isKeyword;
      }
      // If no keywords, treat all strings as keywords (auto, inherit, etc.)
      return false;
    }
    return true; // Numeric values are always custom
  });

  const handleKeywordSelect = (selectedValue: string) => {
    if (selectedValue === "custom") {
      setIsCustomValue(true);
      // Keep the current value if it's numeric, otherwise set to auto
      if (typeof value === "object" && value !== null) {
        onChange(value as any);
      } else {
        onChange({ value: 0, unit: defaultUnit });
      }
    } else {
      setIsCustomValue(false);
      onChange(selectedValue as any);
    }
  };

  const handleCustomValueChange = useCallback(
    (newValue: NumberValueWithUnit | null) => {
      onChange((newValue ?? { value: 0, unit: defaultUnit }) as any);
    },
    [onChange, defaultUnit]
  );

  const t = useI18n("builder");

  const allOptions = hasKeywords
    ? [
        ...globalKeywords,
        ...keywords,
        {
          value: "custom",
          label: "pageBuilder.styles.keywords.custom",
          isKeyword: false,
        },
      ]
    : [
        ...globalKeywords,
        {
          value: "custom",
          label: "pageBuilder.styles.keywords.custom",
          isKeyword: false,
        },
      ];

  // Find the current keyword value
  const currentKeyword = useMemo(
    () =>
      isCustomValue ? "custom" : typeof value === "string" ? value : undefined,
    [isCustomValue, value]
  );

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <div className="flex flex-row gap-2 items-center w-full">
        {icon}
        <Combobox
          values={allOptions.map((option) => ({
            ...option,
            label: t(option.label as BuilderKeys),
          }))}
          value={currentKeyword}
          onItemSelect={handleKeywordSelect}
          className="w-full"
          size="xs"
        />
      </div>

      {isCustomValue && (
        <RawNumberInputWithUnit
          icon={<div />}
          defaultValue={
            typeof value === "object" && value !== null
              ? value
              : { value: 0, unit: defaultUnit }
          }
          onChange={handleCustomValueChange}
          nullable={false}
          {...rest}
        />
      )}
    </div>
  );
};
