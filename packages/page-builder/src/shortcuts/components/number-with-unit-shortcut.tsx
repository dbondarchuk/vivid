import { BuilderKeys } from "@vivid/i18n";
import { RawNumberInputWithUnit } from "../../style-inputs/base/raw-number-input-with-units";
import { StyleValue } from "../../style/css-renderer";
import { BaseStyleDictionary } from "../../style/types";
import { NumberValueWithUnit } from "../../style/zod";
import { ShortcutWithNumberWithUnit } from "../types";

/**
 * Helper function to create number-with-unit shortcuts
 */
export const createNumberWithUnitShortcut = <T extends BaseStyleDictionary>(
  label: BuilderKeys,
  icon: (props: { className?: string }) => React.ReactNode,
  targetStyle: keyof T,
  config: ShortcutWithNumberWithUnit<T>["numberWithUnitConfig"],
): ShortcutWithNumberWithUnit<T> => {
  return {
    label,
    icon,
    inputType: "number-with-unit",
    targetStyle,
    numberWithUnitConfig: config,
  };
};

export const NumberWithUnitShortcut = <T extends BaseStyleDictionary>({
  shortcut,
  styles,
  onStylesChange,
}: {
  shortcut: ShortcutWithNumberWithUnit<T>;
  styles: StyleValue<T>;
  onStylesChange: (styles: StyleValue<T>) => void;
}) => {
  // Get current numeric value directly from the target style
  const currentStyle = styles[shortcut.targetStyle]?.find(
    (s) => !s.breakpoint?.length && !s.state?.length,
  );

  const currentNumericValue: NumberValueWithUnit | null =
    currentStyle?.value &&
    typeof currentStyle.value === "object" &&
    "value" in currentStyle.value &&
    "unit" in currentStyle.value
      ? (currentStyle.value as NumberValueWithUnit)
      : null;

  const config = shortcut.numberWithUnitConfig;

  const handleValueChange = (value: NumberValueWithUnit | null) => {
    if (value) {
      const newStyles = { ...styles };

      if (newStyles[shortcut.targetStyle]) {
        // Update existing style variants
        const currentVariants = newStyles[shortcut.targetStyle];
        if (currentVariants && currentVariants.length > 0) {
          const updatedVariants = currentVariants.map((variant) => ({
            ...variant,
            value,
          }));
          newStyles[shortcut.targetStyle] = updatedVariants;
        }
      } else {
        // Create new style variant
        newStyles[shortcut.targetStyle] = [
          {
            breakpoint: [],
            state: [],
            value,
          },
        ];
      }

      onStylesChange(newStyles);
    }
  };

  return (
    <RawNumberInputWithUnit
      icon={<div className="w-4 h-4" />}
      defaultValue={currentNumericValue || { value: 0, unit: "rem" }}
      onChange={handleValueChange}
      {...config}
      nullable={false}
    />
  );
};
