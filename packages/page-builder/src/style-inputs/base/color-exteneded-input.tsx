import { Sketch } from "@uiw/react-color";
import { ResetButton, type ColorInput } from "@vivid/builder";
import { BuilderKeys, useI18n } from "@vivid/i18n";
import { DistributiveOmit } from "@vivid/types";
import {
  Button,
  Combobox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vivid/ui";
import { Plus } from "lucide-react";
import React from "react";
import { COLORS_LIST } from "../../style/helpers/colors";

type Props = DistributiveOmit<React.ComponentProps<typeof ColorInput>, "label">;

export const ColorExtendedInput: React.FC<Props> = ({
  defaultValue,
  onChange,
  nullable,
}) => {
  const [value, setValue] = React.useState(defaultValue);
  const t = useI18n("builder");
  const getSelectValue = (value?: string | null) =>
    !value && nullable
      ? "default"
      : value?.startsWith("var")
        ? value
        : "custom";

  const [selectValue, setSelectValue] = React.useState(getSelectValue(value));
  const isCustom = selectValue === "custom";

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, setValue]);

  React.useEffect(() => {
    setSelectValue(getSelectValue(value));
  }, [value]);

  React.useEffect(() => {
    const newValue =
      selectValue === "default"
        ? null
        : selectValue === "custom"
          ? "0 0% 100%"
          : selectValue;
    setValue(newValue);
    onChange(newValue as any as string);
  }, [selectValue]);

  const renderOpenButton = () => {
    if (value) {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="border border-secondary w-8"
          style={{ background: `hsl(${value})` }}
        />
      );
    }
    return (
      <Button
        variant="ghost"
        size="sm"
        className="bg-background border border-secondary w-8"
      >
        <Plus size={16} />
      </Button>
    );
  };

  return (
    <div className="flex w-full">
      <Popover>
        <div className="flex flex-row gap-1 w-full">
          <Combobox
            value={selectValue}
            onItemSelect={setSelectValue}
            className="w-full flex-grow"
            size="sm"
            searchLabel={t("pageBuilder.styles.colors.custom")}
            values={[
              ...(nullable
                ? [
                    {
                      value: "default",
                      label: t("pageBuilder.styles.colors.default"),
                    },
                  ]
                : []),
              ...COLORS_LIST.map((c) => ({
                value: c.value,
                label: t(`pageBuilder.styles.colors.${c.key}` as BuilderKeys),
              })),
              {
                value: "custom",
                label: t("pageBuilder.styles.colors.custom"),
              },
            ]}
          />
          {isCustom && (
            <PopoverTrigger asChild>{renderOpenButton()}</PopoverTrigger>
          )}
          {nullable && (
            <ResetButton
              onClick={() => {
                setValue(null);
                onChange(null);
              }}
            />
          )}
        </div>
        <PopoverContent className="bg-transparent border-none shadow-none w-fit">
          <Sketch
            color={value || undefined}
            disableAlpha
            onChange={(c) => {
              const color = `${c.hsl.h.toFixed(0)} ${c.hsl.s.toFixed(1)}% ${c.hsl.l.toFixed(1)}%`;
              setValue(color);
              onChange(color);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
