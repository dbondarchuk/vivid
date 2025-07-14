import { TypeOutline } from "lucide-react";
import { Shortcut } from "../../shortcuts";
import { backgroundColorShortcut } from "../../shortcuts/common/background-color";
import { colorShortcut } from "../../shortcuts/common/color";
import { fontFamilyShortcut } from "../../shortcuts/common/font-family";
import { AllStylesSchemas } from "../../style";

export const headingShortcuts: Shortcut<AllStylesSchemas>[] = [
  {
    label: "pageBuilder.blocks.heading.style",
    icon: ({ className }) => <TypeOutline className={className} />,
    options: [
      {
        label: "pageBuilder.blocks.heading.styles.display",
        value: "display",
        targetStyles: {
          fontSize: {
            value: 3,
            unit: "rem",
          },
          fontWeight: "bold",
          textAlign: "center",
          margin: (prev) => ({
            top: prev?.top ?? "auto",
            bottom: { value: 1.5, unit: "rem" },
            left: prev?.left ?? "auto",
            right: prev?.right ?? "auto",
          }),
          padding: (prev) => ({
            top: { value: 2, unit: "rem" },
            bottom: { value: 2, unit: "rem" },
            left: prev?.left ?? { value: 0, unit: "rem" },
            right: prev?.right ?? { value: 0, unit: "rem" },
          }),
        },
      },
      {
        label: "pageBuilder.blocks.heading.styles.title",
        value: "title",
        targetStyles: {
          fontSize: {
            value: 2,
            unit: "rem",
          },
          fontWeight: "bold",
          textAlign: "center",
          margin: (prev) => ({
            top: prev?.top ?? "auto",
            bottom: { value: 1, unit: "rem" },
            left: prev?.left ?? "auto",
            right: prev?.right ?? "auto",
          }),
          padding: (prev) => ({
            top: { value: 1, unit: "rem" },
            bottom: { value: 1, unit: "rem" },
            left: prev?.left ?? { value: 0, unit: "rem" },
            right: prev?.right ?? { value: 0, unit: "rem" },
          }),
        },
      },
      {
        label: "pageBuilder.blocks.heading.styles.subtitle",
        value: "subtitle",
        targetStyles: {
          fontSize: {
            value: 1.25,
            unit: "rem",
          },
          fontWeight: "600",
          textAlign: "center",
          margin: (prev) => ({
            top: prev?.top ?? "auto",
            bottom: { value: 0.75, unit: "rem" },
            left: prev?.left ?? "auto",
            right: prev?.right ?? "auto",
          }),
          padding: (prev) => ({
            top: { value: 0.5, unit: "rem" },
            bottom: { value: 0.5, unit: "rem" },
            left: prev?.left ?? { value: 0, unit: "rem" },
            right: prev?.right ?? { value: 0, unit: "rem" },
          }),
        },
      },
      {
        label: "pageBuilder.blocks.heading.styles.caption",
        value: "caption",
        targetStyles: {
          fontSize: {
            value: 0.875,
            unit: "rem",
          },
          fontWeight: "normal",
          textAlign: "center",
          margin: (prev) => ({
            top: prev?.top ?? "auto",
            bottom: { value: 0.5, unit: "rem" },
            left: prev?.left ?? "auto",
            right: prev?.right ?? "auto",
          }),
          padding: (prev) => ({
            top: { value: 0.25, unit: "rem" },
            bottom: { value: 0.25, unit: "rem" },
            left: prev?.left ?? { value: 0, unit: "rem" },
            right: prev?.right ?? { value: 0, unit: "rem" },
          }),
        },
      },
    ],
  },
  backgroundColorShortcut,
  fontFamilyShortcut,
  colorShortcut,
];
