import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignVerticalSpaceBetween,
  ArrowRight,
  Box,
  Maximize,
  Move,
  WrapText,
} from "lucide-react";
import { Shortcut } from "../../shortcuts";
import { backgroundColorShortcut } from "../../shortcuts/common/background-color";
import { backgroundImageShortcut } from "../../shortcuts/common/background-image";
import { colorShortcut } from "../../shortcuts/common/color";
import { fontFamilyShortcut } from "../../shortcuts/common/font-family";
import { AllStylesSchemas } from "../../style";

export const containerShortcuts: Shortcut<AllStylesSchemas>[] = [
  {
    label: "pageBuilder.blocks.container.shortcuts.padding",
    icon: AlignVerticalSpaceBetween,
    options: [
      {
        label: "pageBuilder.blocks.container.paddings.none",
        value: "none",
        targetStyles: {
          padding: {
            top: { value: 0, unit: "px" },
            bottom: { value: 0, unit: "px" },
            left: { value: 0, unit: "px" },
            right: { value: 0, unit: "px" },
          },
        },
      },
      {
        label: "pageBuilder.blocks.container.paddings.small",
        value: "small",
        targetStyles: {
          padding: {
            top: { value: 8, unit: "px" },
            bottom: { value: 8, unit: "px" },
            left: { value: 12, unit: "px" },
            right: { value: 12, unit: "px" },
          },
        },
      },
      {
        label: "pageBuilder.blocks.container.paddings.medium",
        value: "medium",
        targetStyles: {
          padding: {
            top: { value: 16, unit: "px" },
            bottom: { value: 16, unit: "px" },
            left: { value: 24, unit: "px" },
            right: { value: 24, unit: "px" },
          },
        },
      },
      {
        label: "pageBuilder.blocks.container.paddings.large",
        value: "large",
        targetStyles: {
          padding: {
            top: { value: 24, unit: "px" },
            bottom: { value: 24, unit: "px" },
            left: { value: 32, unit: "px" },
            right: { value: 32, unit: "px" },
          },
        },
      },
      {
        label: "pageBuilder.blocks.container.paddings.x-large",
        value: "x-large",
        targetStyles: {
          padding: {
            top: { value: 32, unit: "px" },
            bottom: { value: 32, unit: "px" },
            left: { value: 48, unit: "px" },
            right: { value: 48, unit: "px" },
          },
        },
      },
    ],
  },
  {
    label: "pageBuilder.blocks.container.shortcuts.gap",
    icon: Move,
    options: [
      {
        label: "pageBuilder.blocks.container.gaps.none",
        value: "none",
        targetStyles: {
          gap: { value: 0, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.container.gaps.small",
        value: "small",
        targetStyles: {
          gap: { value: 0.25, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.container.gaps.medium",
        value: "medium",
        targetStyles: {
          gap: { value: 0.5, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.container.gaps.large",
        value: "large",
        targetStyles: {
          gap: { value: 1, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.container.gaps.x-large",
        value: "x-large",
        targetStyles: {
          gap: { value: 1.5, unit: "rem" },
        },
      },
    ],
  },
  {
    label: "pageBuilder.blocks.container.shortcuts.flexDirection",
    icon: ArrowRight,
    options: [
      {
        label: "pageBuilder.blocks.container.flexDirections.row",
        value: "row",
        targetStyles: {
          flexDirection: "row",
        },
      },
      {
        label: "pageBuilder.blocks.container.flexDirections.column",
        value: "column",
        targetStyles: {
          flexDirection: "column",
        },
      },
      {
        label: "pageBuilder.blocks.container.flexDirections.rowReverse",
        value: "row-reverse",
        targetStyles: {
          flexDirection: "row-reverse",
        },
      },
      {
        label: "pageBuilder.blocks.container.flexDirections.columnReverse",
        value: "column-reverse",
        targetStyles: {
          flexDirection: "column-reverse",
        },
      },
    ],
  },
  {
    label: "pageBuilder.blocks.container.shortcuts.flexWrap",
    icon: WrapText,
    options: [
      {
        label: "pageBuilder.blocks.container.flexWraps.nowrap",
        value: "nowrap",
        targetStyles: {
          flexWrap: "nowrap",
          display: "flex",
        },
      },
      {
        label: "pageBuilder.blocks.container.flexWraps.wrap",
        value: "wrap",
        targetStyles: {
          flexWrap: "wrap",
          display: "flex",
        },
      },
      {
        label: "pageBuilder.blocks.container.flexWraps.wrapReverse",
        value: "wrap-reverse",
        targetStyles: {
          flexWrap: "wrap-reverse",
          display: "flex",
        },
      },
    ],
  },
  {
    label: "pageBuilder.blocks.container.shortcuts.justifyContent",
    icon: AlignCenterHorizontal,
    options: [
      {
        label: "pageBuilder.blocks.container.justifyContents.start",
        value: "flex-start",
        targetStyles: {
          justifyContent: "flex-start",
          display: "flex",
        },
      },
      {
        label: "pageBuilder.blocks.container.justifyContents.center",
        value: "center",
        targetStyles: {
          justifyContent: "center",
          display: "flex",
        },
      },
      {
        label: "pageBuilder.blocks.container.justifyContents.end",
        value: "flex-end",
        targetStyles: {
          justifyContent: "flex-end",
          display: "flex",
        },
      },
      {
        label: "pageBuilder.blocks.container.justifyContents.spaceBetween",
        value: "space-between",
        targetStyles: {
          justifyContent: "space-between",
          display: "flex",
        },
      },
      {
        label: "pageBuilder.blocks.container.justifyContents.spaceAround",
        value: "space-around",
        targetStyles: {
          justifyContent: "space-around",
          display: "flex",
        },
      },
      {
        label: "pageBuilder.blocks.container.justifyContents.spaceEvenly",
        value: "space-evenly",
        targetStyles: {
          justifyContent: "space-evenly",
          display: "flex",
        },
      },
    ],
  },
  {
    label: "pageBuilder.blocks.container.shortcuts.alignItems",
    icon: AlignCenterVertical,
    options: [
      {
        label: "pageBuilder.blocks.container.alignItemses.start",
        value: "flex-start",
        targetStyles: {
          alignItems: "flex-start",
          display: "flex",
        },
      },
      {
        label: "pageBuilder.blocks.container.alignItemses.center",
        value: "center",
        targetStyles: {
          alignItems: "center",
          display: "flex",
        },
      },
      {
        label: "pageBuilder.blocks.container.alignItemses.end",
        value: "flex-end",
        targetStyles: {
          alignItems: "flex-end",
          display: "flex",
        },
      },
      {
        label: "pageBuilder.blocks.container.alignItemses.stretch",
        value: "stretch",
        targetStyles: {
          alignItems: "stretch",
          display: "flex",
        },
      },
      {
        label: "pageBuilder.blocks.container.alignItemses.baseline",
        value: "baseline",
        targetStyles: {
          alignItems: "baseline",
          display: "flex",
        },
      },
    ],
  },
  {
    label: "pageBuilder.blocks.container.shortcuts.style",
    icon: Box,
    options: [
      {
        label: "pageBuilder.blocks.container.styles.plain",
        value: "plain",
        targetStyles: {
          backgroundColor: undefined,
          borderColor: undefined,
          borderRadius: undefined,
        },
      },
      {
        label: "pageBuilder.blocks.container.styles.card",
        value: "card",
        targetStyles: {
          backgroundColor: "var(--value-card-color)",
          borderColor: "var(--value-card-color)",
          borderRadius: { value: 0.5, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.container.styles.paper",
        value: "paper",
        targetStyles: {
          backgroundColor: "var(--value-background-color)",
          borderColor: "var(--value-card-color)",
          borderRadius: { value: 0.25, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.container.styles.rounded",
        value: "rounded",
        targetStyles: {
          backgroundColor: "var(--value-background-color)",
          borderColor: "var(--value-card-color)",
          borderRadius: { value: 0.75, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.container.styles.bordered",
        value: "bordered",
        targetStyles: {
          backgroundColor: undefined,
          borderColor: "var(--value-card-color)",
          borderRadius: { value: 0.375, unit: "rem" },
        },
      },
    ],
  },
  {
    label: "pageBuilder.blocks.container.shortcuts.width",
    icon: Maximize,
    options: [
      {
        label: "pageBuilder.blocks.container.widths.full",
        value: "full",
        targetStyles: {
          width: { value: 100, unit: "%" },
          maxWidth: undefined, // Explicitly remove maxWidth when switching to full width
          margin: {
            top: "auto",
            right: "auto",
            bottom: "auto",
            left: "auto",
          },
        },
      },
      {
        label: "pageBuilder.blocks.container.widths.contained",
        value: "contained",
        targetStyles: {
          width: { value: 100, unit: "%" },
          maxWidth: {
            variants: [
              { value: { value: 640, unit: "px" }, breakpoint: [] },
              { value: { value: 768, unit: "px" }, breakpoint: ["sm"] },
              { value: { value: 1024, unit: "px" }, breakpoint: ["md"] },
              { value: { value: 1280, unit: "px" }, breakpoint: ["lg"] },
              { value: { value: 1536, unit: "px" }, breakpoint: ["xl"] },
              { value: { value: 1536, unit: "px" }, breakpoint: ["2xl"] },
            ],
          },
          margin: {
            top: "auto",
            right: "auto",
            bottom: "auto",
            left: "auto",
          },
        },
      },
    ],
  },
  backgroundColorShortcut,
  backgroundImageShortcut as Shortcut<AllStylesSchemas>,
  fontFamilyShortcut as Shortcut<AllStylesSchemas>,
  colorShortcut,
];
