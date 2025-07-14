import { Shortcut } from "../../shortcuts";
import { colorShortcut } from "../../shortcuts/common/color";
import { fontFamilyShortcut } from "../../shortcuts/common/font-family";
import { AllStylesSchemas } from "../../style";

export const carouselShortcuts: Shortcut<AllStylesSchemas>[] = [
  // {
  //   label: "pageBuilder.blocks.container.shortcuts.widthContainer",
  //   icon: Maximize,
  //   inputType: "toggle",
  //   options: [
  //     {
  //       label: "pageBuilder.blocks.container.widthContainers.full",
  //       targetStyles: {
  //         width: {
  //           value: 100,
  //           unit: "%",
  //         },
  //       },
  //     },
  //     {
  //       label: "pageBuilder.blocks.container.widthContainers.container",
  //       targetStyles: {
  //         width: "100%",
  //       },
  //     },
  //   ],
  // },
  // backgroundColorShortcut,
  // backgroundImageShortcut as Shortcut<AllStylesSchemas>,
  fontFamilyShortcut,
  colorShortcut,
];
