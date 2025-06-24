import {
  ToolbarDropdownMenu,
  ToolbarDropdownPropsValues,
} from "@vivid/builder";
import { Bold } from "lucide-react";
import { FontWeight } from "../style-inputs/helpers/zod";
import { Leaves } from "@vivid/utils";
import { useI18n } from "@vivid/i18n";

type PropsType = { style?: { fontWeight?: FontWeight | null } | null };

export const FontWeightDropdownMenu = <T extends PropsType>(
  props: ToolbarDropdownPropsValues<T>
) => {
  const t = useI18n("builder");

  const fontWeightItems = [
    {
      value: "normal",
      label: t("emailBuilder.common.toolbars.fontWeight.normal"),
    },
    {
      value: "bold",
      label: t("emailBuilder.common.toolbars.fontWeight.bold"),
    },
  ];

  return (
    <ToolbarDropdownMenu
      icon={<Bold />}
      items={fontWeightItems}
      property={"style.fontWeight" as Leaves<T>}
      tooltip={t("emailBuilder.common.toolbars.fontWeight.label")}
      {...props}
    />
  );
};
