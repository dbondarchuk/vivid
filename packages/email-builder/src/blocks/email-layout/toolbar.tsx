import {
  ConfigurationProps,
  ToolbarColorMenu,
  ToolbarDropdownMenu,
  ToolbarDropdownPropsValues,
} from "@vivid/builder";
import { Baseline, Brush, PaintBucket, PaintRoller } from "lucide-react";
import { FONT_FAMILIES } from "../../style-inputs/helpers/font-family";
import { fontFamilyItems } from "../../toolbars/font-family";
import { EmailLayoutDefaultProps, EmailLayoutProps } from "./schema";

const LayoutFontFamilyDropdownMenu = (
  props: ToolbarDropdownPropsValues<EmailLayoutProps>
) => {
  const selectedFont = FONT_FAMILIES.find(
    (font) => font.key === props.data?.fontFamily
  );

  return (
    <ToolbarDropdownMenu
      icon={
        <span className="text-xs" style={{ fontFamily: selectedFont?.value }}>
          {selectedFont?.label ?? "Inherit"}
        </span>
      }
      items={fontFamilyItems}
      property="fontFamily"
      tooltip="Font family"
      {...props}
    />
  );
};

export const EmailLayoutToolbar = (
  props: ConfigurationProps<EmailLayoutProps>
) => (
  <>
    <LayoutFontFamilyDropdownMenu
      defaultValue={EmailLayoutDefaultProps.fontFamily}
      {...props}
    />
    <ToolbarColorMenu
      icon={<Baseline />}
      property="textColor"
      tooltip="Text color"
      defaultValue={EmailLayoutDefaultProps.textColor}
      {...props}
    />
    <ToolbarColorMenu
      icon={<PaintBucket />}
      property="canvasColor"
      tooltip="Canvas color"
      defaultValue={EmailLayoutDefaultProps.canvasColor}
      {...props}
    />
    <ToolbarColorMenu
      icon={<PaintRoller />}
      property="backdropColor"
      tooltip="Backdrop color"
      defaultValue={EmailLayoutDefaultProps.backdropColor}
      {...props}
    />
    <ToolbarColorMenu
      nullable
      icon={<Brush />}
      property="borderColor"
      tooltip="Border color"
      {...props}
    />
  </>
);
