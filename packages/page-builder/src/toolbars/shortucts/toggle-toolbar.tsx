import { BuilderKeys, useI18n } from "@vivid/i18n";
import { ToolbarButton } from "@vivid/ui";
import { Shortcut } from "../../shortcuts";
import { BaseStyleDictionary } from "../../style/types";
import { applyShortcut, getCurrentValue } from "./dropdown-toolbar";

export interface ShortcutToggleToolbarItem {
  shortcut: Extract<Shortcut<BaseStyleDictionary>, { inputType: "toggle" }>;
  currentValue: string;
  onValueChange: (value: string) => void;
  tooltip: BuilderKeys;
}

export const createToggleToolbarItem = <T extends BaseStyleDictionary>(
  shortcut: Extract<Shortcut<T>, { inputType: "toggle" }>,
  data: any,
  setData: (data: any) => void
): ShortcutToggleToolbarItem => {
  return {
    shortcut,
    currentValue: getCurrentValue(shortcut, data) || "",
    onValueChange: (optionValue: string) =>
      applyShortcut(shortcut, data, setData, optionValue),
    tooltip: shortcut.label,
  };
};

export const ToggleToolbar = ({
  shortcut,
}: {
  shortcut: ShortcutToggleToolbarItem;
}) => {
  const t = useI18n("builder");

  return (
    <ToolbarButton
      pressed={shortcut.currentValue === shortcut.shortcut.options[1].value}
      tooltip={t(shortcut.tooltip)}
      onClick={() =>
        shortcut.onValueChange(
          shortcut.currentValue === shortcut.shortcut.options[1].value
            ? shortcut.shortcut.options[0].value
            : shortcut.shortcut.options[1].value
        )
      }
      className="text-xs"
    >
      <shortcut.shortcut.icon className="size-4" />
    </ToolbarButton>
  );
};
