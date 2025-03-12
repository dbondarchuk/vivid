import { ConfigurationProps, ToolbarDropdownMenu } from "@vivid/builder";
import { Circle, Square, SquareRoundCorner } from "lucide-react";
import { TextAlignDropdownMenu } from "../../toolbars/text-align";
import { AvatarProps, AvatarPropsDefaults } from "./schema";

const shapeItems = [
  {
    icon: <Circle />,
    value: "circle",
    label: "Circle",
  },
  {
    icon: <Square />,
    value: "square",
    label: "Square",
  },
  {
    icon: <SquareRoundCorner />,
    value: "rounded",
    label: "Rounded",
  },
];

export const AvatarToolbar = (props: ConfigurationProps<AvatarProps>) => (
  <>
    <TextAlignDropdownMenu
      {...props}
      defaultValue={AvatarPropsDefaults.style.textAlign}
    />
    <ToolbarDropdownMenu
      items={shapeItems}
      defaultValue={AvatarPropsDefaults.props.shape}
      property="props.shape"
      tooltip="Shape"
      {...props}
    />
  </>
);
