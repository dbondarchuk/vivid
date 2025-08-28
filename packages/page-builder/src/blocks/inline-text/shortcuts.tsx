import { Shortcut } from "../../shortcuts";
import { backgroundColorShortcut } from "../../shortcuts/common/background-color";
import { colorShortcut } from "../../shortcuts/common/color";
import { fontFamilyShortcut } from "../../shortcuts/common/font-family";
import { AllStylesSchemas } from "../../style";

export const inlineTextShortcuts: Shortcut<AllStylesSchemas>[] = [
  backgroundColorShortcut,
  fontFamilyShortcut as Shortcut<AllStylesSchemas>,
  colorShortcut,
];
