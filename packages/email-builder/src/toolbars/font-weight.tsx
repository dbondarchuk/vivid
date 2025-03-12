import {
  ToolbarDropdownMenu,
  ToolbarDropdownPropsValues,
} from "@vivid/builder";
import { Bold } from "lucide-react";
import { FontWeight } from "../style-inputs/helpers/zod";
import { Leaves } from "@vivid/utils";

const fontWeightItems = [
  {
    value: "normal",
    label: "Normal",
  },
  {
    value: "bold",
    label: "Bold",
  },
];

type PropsType = { style?: { fontWeight?: FontWeight | null } | null };

export const FontWeightDropdownMenu = <T extends PropsType>(
  props: ToolbarDropdownPropsValues<T>
) => (
  <ToolbarDropdownMenu
    icon={<Bold />}
    items={fontWeightItems}
    property={"style.fontWeight" as Leaves<T>}
    tooltip="Font weight"
    {...props}
  />
);
