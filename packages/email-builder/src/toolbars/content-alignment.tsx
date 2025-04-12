import {
  ToolbarDropdownMenu,
  ToolbarDropdownPropsValues,
} from "@vivid/builder";
import { Leaves } from "@vivid/utils";
import { ArrowUpToLine, FoldVertical, ArrowDownToLine } from "lucide-react";

const alignItems = [
  {
    icon: <ArrowUpToLine />,
    value: "top",
    label: "Top",
  },
  {
    icon: <FoldVertical />,
    value: "middle",
    label: "Middle",
  },
  {
    icon: <ArrowDownToLine />,
    value: "bottom",
    label: "Bottom",
  },
];

type PropsType = {
  props?: { contentAlignment?: "top" | "middle" | "bottom" | null } | null;
};

export const ContentAlignmentDropdownMenu = <T extends PropsType>(
  props: ToolbarDropdownPropsValues<T>
) => (
  <ToolbarDropdownMenu
    items={alignItems}
    tooltip="Alignment"
    property={"props.contentAlignment" as Leaves<T>}
    {...props}
  />
);
