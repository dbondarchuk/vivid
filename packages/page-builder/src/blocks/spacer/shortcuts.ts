import { Ruler } from "lucide-react";
import { Shortcut } from "../../shortcuts";
import { backgroundColorShortcut } from "../../shortcuts/common/background-color";
import { AllStylesSchemas } from "../../style";

export const spacerShortcuts: Shortcut<AllStylesSchemas>[] = [
  {
    label: "pageBuilder.blocks.spacer.shortcuts.height",
    icon: Ruler,
    options: [
      {
        label: "pageBuilder.blocks.spacer.heights.tiny",
        value: "tiny",
        targetStyles: {
          height: { value: 1, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.spacer.heights.small",
        value: "small",
        targetStyles: {
          height: { value: 2, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.spacer.heights.medium",
        value: "medium",
        targetStyles: {
          height: { value: 3, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.spacer.heights.large",
        value: "large",
        targetStyles: {
          height: { value: 4, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.spacer.heights.x-large",
        value: "x-large",
        targetStyles: {
          height: { value: 8, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.spacer.heights.huge",
        value: "huge",
        targetStyles: {
          height: { value: 16, unit: "rem" },
        },
      },
    ],
  },
  backgroundColorShortcut as Shortcut<AllStylesSchemas>,
];
