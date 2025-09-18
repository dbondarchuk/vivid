import { ConfigurationProps, ToolbarDropdownMenu } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { Circle, Square, SquareRoundCorner } from "lucide-react";
import { TextAlignDropdownMenu } from "../../toolbars/text-align";
import { AvatarProps, AvatarPropsDefaults } from "./schema";

export const AvatarToolbar = (props: ConfigurationProps<AvatarProps>) => {
  const t = useI18n("builder");
  const shapeItems = [
    {
      icon: <Circle />,
      value: "circle",
      label: t("emailBuilder.blocks.avatar.shapes.circle"),
    },
    {
      icon: <Square />,
      value: "square",
      label: t("emailBuilder.blocks.avatar.shapes.square"),
    },
    {
      icon: <SquareRoundCorner />,
      value: "rounded",
      label: t("emailBuilder.blocks.avatar.shapes.rounded"),
    },
  ];

  return (
    <>
      <TextAlignDropdownMenu
        {...props}
        defaultValue={AvatarPropsDefaults.style.textAlign}
      />
      <ToolbarDropdownMenu
        items={shapeItems}
        defaultValue={AvatarPropsDefaults.props.shape}
        property="props.shape"
        tooltip={t("emailBuilder.blocks.avatar.shape")}
        {...props}
      />
    </>
  );
};
