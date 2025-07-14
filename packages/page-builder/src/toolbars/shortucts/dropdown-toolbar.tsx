import { BuilderKeys, useI18n } from "@vivid/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  ToolbarButton,
  useOpenState,
} from "@vivid/ui";
import { Shortcut, ShortcutOption } from "../../shortcuts";
import { BaseStyleDictionary } from "../../style/types";

export interface ShortcutDropdownToolbarItem {
  shortcut: Extract<
    Shortcut<BaseStyleDictionary>,
    { options: ShortcutOption<BaseStyleDictionary>[] }
  >;

  currentValue: string;
  onValueChange: (value: string) => void;
  tooltip: BuilderKeys;
}

// Get current value for this shortcut
export const getCurrentValue = <T extends BaseStyleDictionary>(
  shortcut: Extract<Shortcut<T>, { options: ShortcutOption<T>[] }>,
  data: any
): string | undefined => {
  for (const option of shortcut.options) {
    const matches = Object.keys(option.targetStyles).every(
      (styleName: keyof T) => {
        const targetValue = option.targetStyles[styleName];
        const currentStyle = data.style?.[styleName]?.find(
          (s: any) => !s.breakpoint?.length && !s.state?.length
        );

        if (!currentStyle) return false;

        const target =
          typeof targetValue === "function"
            ? targetValue(currentStyle.value)
            : targetValue;

        const currentValue = currentStyle.value;
        return JSON.stringify(currentValue) === JSON.stringify(target);
      }
    );

    if (matches) {
      return option.value;
    }
  }
  return undefined;
};

// Apply shortcut option
export const applyShortcut = <T extends BaseStyleDictionary>(
  shortcut: Extract<Shortcut<T>, { options: ShortcutOption<T>[] }>,
  data: any,
  setData: (data: any) => void,
  optionValue: string
) => {
  const selectedOption = shortcut.options.find(
    (opt) => opt.value === optionValue
  );
  if (!selectedOption) return;

  const newData = { ...data };
  const newStyles = { ...newData.style };

  // Apply each target style
  Object.keys(selectedOption.targetStyles).forEach((styleName: keyof T) => {
    const value = selectedOption.targetStyles[styleName];

    if (newStyles[styleName]) {
      // Update existing style variants
      const currentVariants = newStyles[styleName];
      if (currentVariants && currentVariants.length > 0) {
        const updatedVariants = currentVariants.map((variant: any) => ({
          ...variant,
          value: typeof value === "function" ? value(variant.value) : value,
        }));
        newStyles[styleName] = updatedVariants;
      }
    } else {
      // Create new style variant
      newStyles[styleName] = [
        {
          breakpoint: [],
          state: [],
          value: typeof value === "function" ? value() : value,
        },
      ];
    }
  });

  newData.style = newStyles;
  setData(newData);
};

export const createDropdownToolbarItem = <T extends BaseStyleDictionary>(
  shortcut: Extract<Shortcut<T>, { options: ShortcutOption<T>[] }>,
  data: any,
  setData: (data: any) => void
): ShortcutDropdownToolbarItem => {
  return {
    shortcut,
    currentValue: getCurrentValue(shortcut, data) || "",
    onValueChange: (optionValue: string) =>
      applyShortcut(shortcut, data, setData, optionValue),
    tooltip: shortcut.label,
  };
};

export const DropdownToolbar = ({
  shortcut,
}: {
  shortcut: ShortcutDropdownToolbarItem;
}) => {
  const t = useI18n("builder");
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          pressed={openState.open}
          tooltip={t(shortcut.tooltip)}
          isDropdown
          className="text-xs"
        >
          <shortcut.shortcut.icon className="size-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-0" align="start">
        <DropdownMenuRadioGroup
          value={shortcut.currentValue}
          onValueChange={shortcut.onValueChange}
        >
          {shortcut.shortcut.options.map(({ value, label, labelStyle }) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              className="min-w-[180px]"
              style={labelStyle}
            >
              {t.has(label) ? t(label) : label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
