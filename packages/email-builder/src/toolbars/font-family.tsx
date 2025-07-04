import {
  ToolbarDropdownMenu,
  ToolbarDropdownPropsValues,
} from "@vivid/builder";
import { Bold } from "lucide-react";
import { FontFamily, FontWeight } from "../style-inputs/helpers/zod";
import { Leaves } from "@vivid/utils";
import { FONT_FAMILIES } from "../style-inputs/helpers/font-family";
import { useI18n } from "@vivid/i18n";

export const fontFamilyItems = [
  {
    value: null,
    label: "Inherit",
  },
  ...FONT_FAMILIES.map((font) => ({
    value: font.key,
    label: font.label,
    style: { fontFamily: font.value },
  })),
];

type PropsType = { style?: { fontFamily?: FontFamily | null } | null };

export const FontFamilyDropdownMenu = <T extends PropsType>(
  props: Omit<ToolbarDropdownPropsValues<T>, "defaultValue">
) => {
  const t = useI18n("builder");
  const selectedFont = FONT_FAMILIES.find(
    (font) => font.key === props.data?.style?.fontFamily
  );

  return (
    <ToolbarDropdownMenu
      icon={
        <span className="text-xs" style={{ fontFamily: selectedFont?.value }}>
          {selectedFont?.label ??
            t("emailBuilder.common.toolbars.fontFamily.inherit")}
        </span>
      }
      defaultValue={null as any as string}
      items={fontFamilyItems}
      property={"style.fontFamily" as Leaves<T>}
      tooltip={t("emailBuilder.common.toolbars.fontFamily.label")}
      {...props}
    />
  );
};
