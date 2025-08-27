import { MoveDiagonal2 } from "lucide-react";
import { Shortcut } from "../../shortcuts";
import { colorShortcut } from "../../shortcuts/common/color";
import { AllStylesSchemas } from "../../style";

export const iconShortcuts: Shortcut<AllStylesSchemas>[] = [
  {
    label: "pageBuilder.blocks.icon.size",
    icon: ({ className }) => <MoveDiagonal2 className={className} />,
    inputType: "combobox",
    options: [
      {
        label: "pageBuilder.blocks.icon.sizes.small",
        value: "small",
        targetStyles: {
          width: { value: 1, unit: "rem" },
          height: { value: 1, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.icon.sizes.medium",
        value: "medium",
        targetStyles: {
          width: { value: 1.5, unit: "rem" },
          height: { value: 1.5, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.icon.sizes.large",
        value: "large",
        targetStyles: {
          width: { value: 2, unit: "rem" },
          height: { value: 2, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.icon.sizes.xlarge",
        value: "xlarge",
        targetStyles: {
          width: { value: 3, unit: "rem" },
          height: { value: 3, unit: "rem" },
        },
      },
      {
        label: "pageBuilder.blocks.icon.sizes.xxlarge",
        value: "xxlarge",
        targetStyles: {
          width: { value: 4, unit: "rem" },
          height: { value: 4, unit: "rem" },
        },
      },
    ],
  },
  colorShortcut,
];
