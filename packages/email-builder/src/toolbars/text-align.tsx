import {
  ToolbarDropdownMenu,
  ToolbarDropdownPropsValues,
} from "@vivid/builder";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { TextAlign } from "../style-inputs/helpers/zod";
import { Leaves } from "@vivid/utils";

const items = [
  {
    icon: <AlignLeft />,
    value: "left",
    label: "Left",
  },
  {
    icon: <AlignCenter />,
    value: "center",
    label: "Center",
  },
  {
    icon: <AlignRight />,
    value: "right",
    label: "Right",
  },
];

type PropsType = { style?: { textAlign?: TextAlign | null } | null };

export const TextAlignDropdownMenu = <T extends PropsType>(
  props: ToolbarDropdownPropsValues<T>
) => {
  return (
    <ToolbarDropdownMenu
      items={items}
      tooltip="Align"
      property={"style.textAlign" as Leaves<T>}
      {...props}
    />
  );
};
