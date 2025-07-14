import {
  ToolbarDropdownMenu,
  ToolbarDropdownPropsValues,
} from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { Leaves } from "@vivid/types";
import { ArrowDownToLine, ArrowUpToLine, FoldVertical } from "lucide-react";

type PropsType = {
  props?: { contentAlignment?: "top" | "middle" | "bottom" | null } | null;
};

export const ContentAlignmentDropdownMenu = <T extends PropsType>(
  props: ToolbarDropdownPropsValues<T>
) => {
  const t = useI18n("builder");
  const alignItems = [
    {
      icon: <ArrowUpToLine />,
      value: "top",
      label: t("emailBuilder.common.toolbars.contentAlignment.top"),
    },
    {
      icon: <FoldVertical />,
      value: "middle",
      label: t("emailBuilder.common.toolbars.contentAlignment.middle"),
    },
    {
      icon: <ArrowDownToLine />,
      value: "bottom",
      label: t("emailBuilder.common.toolbars.contentAlignment.bottom"),
    },
  ];

  return (
    <ToolbarDropdownMenu
      items={alignItems}
      tooltip={t("emailBuilder.common.toolbars.contentAlignment.label")}
      property={"props.contentAlignment" as Leaves<T>}
      {...props}
    />
  );
};
