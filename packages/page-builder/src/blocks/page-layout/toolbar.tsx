import {
  ConfigurationProps,
  ToolbarDropdownMenu,
  ToolbarDropdownPropsValues,
  ToolbarToggle,
} from "@vivid/builder";
import {
  AlignHorizontalSpaceAround,
  Baseline,
  PaintBucket,
} from "lucide-react";
import { FONT_FAMILIES } from "../../style-inputs/helpers/font-family";
import { ToolbarColorMenu } from "../../toolbars/color";
import {
  FontFamilyDropdownMenu,
  fontFamilyItems,
} from "../../toolbars/font-family";
import { PageLayoutDefaultProps, PageLayoutProps } from "./schema";
import { BuilderKeys, useI18n } from "@vivid/i18n";
import { FontFamily } from "../../style";
import { ColorShortcutToolbar } from "../../toolbars/shortucts/color-shortcut-toolbar";
import { colorShortcut } from "../../shortcuts/common/color";
import { backgroundColorShortcut } from "../../shortcuts/common/background-color";

const LayoutFontFamilyDropdownMenu = (
  props: ToolbarDropdownPropsValues<PageLayoutProps>
) => {
  const selectedFont = props.data?.fontFamily
    ? FONT_FAMILIES[props.data?.fontFamily]
    : null;

  const t = useI18n("builder");

  return (
    <ToolbarDropdownMenu
      icon={
        <span className="text-xs" style={{ fontFamily: selectedFont?.value }}>
          {selectedFont?.label
            ? t.has(selectedFont?.label as BuilderKeys)
              ? t(selectedFont?.label as BuilderKeys)
              : selectedFont?.label
            : t("pageBuilder.styles.fontFamily.inherit")}
        </span>
      }
      items={fontFamilyItems.map((item) => ({
        ...item,
        style: { fontFamily: item.value as FontFamily },
        label: t.has(item.label as BuilderKeys)
          ? t(item.label as BuilderKeys)
          : item.label,
      }))}
      property="fontFamily"
      tooltip={t("pageBuilder.styles.properties.fontFamily")}
      {...props}
    />
  );
};

export const PageLayoutToolbar = (
  props: ConfigurationProps<PageLayoutProps>
) => {
  const t = useI18n("builder");
  return (
    <>
      <ToolbarToggle
        tooltip="Full width"
        property="fullWidth"
        {...props}
        icon={<AlignHorizontalSpaceAround />}
      />
      <LayoutFontFamilyDropdownMenu
        defaultValue={PageLayoutDefaultProps.fontFamily}
        {...props}
      />
      <ColorShortcutToolbar
        shortcut={{
          shortcut: colorShortcut,
          currentColorValue: props.data.textColor ?? null,
          onValueChange: (value) =>
            props.setData({ ...props.data, textColor: value }),
          tooltip: "pageBuilder.styles.properties.color",
        }}
      />
      <ColorShortcutToolbar
        shortcut={{
          shortcut: backgroundColorShortcut,
          currentColorValue: props.data.backgroundColor ?? null,
          onValueChange: (value) =>
            props.setData({ ...props.data, backgroundColor: value }),
          tooltip: "pageBuilder.styles.properties.backgroundColor",
        }}
      />
    </>
  );
};
