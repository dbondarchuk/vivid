import { RadioGroup, RadioGroupItem, Label } from "@vivid/ui";
import { BaseStyleDictionary } from "../../style/types";
import { ShortcutOption, ShortcutWithRadio } from "../types";
import { useI18n } from "@vivid/i18n";

export const RadioGroupShortcut = <T extends BaseStyleDictionary>({
  shortcut,
  currentValue,
  applyShortcut,
}: {
  shortcut: ShortcutWithRadio<T>;
  currentValue: string;
  applyShortcut: (option: ShortcutOption<T>) => void;
}) => {
  const t = useI18n("builder");
  return (
    <RadioGroup
      value={currentValue || ""}
      onValueChange={(value) => {
        const selectedOption = shortcut.options.find(
          (opt) => opt.value === value
        );
        if (selectedOption) {
          applyShortcut(selectedOption);
        }
      }}
      className="flex flex-wrap gap-2"
    >
      {shortcut.options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option.value}
            id={`${shortcut.label}-${option.value}`}
          />
          <Label
            htmlFor={`${shortcut.label}-${option.value}`}
            className="text-xs"
            style={option.labelStyle}
          >
            {t.has(option.label) ? t(option.label) : option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
