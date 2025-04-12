import {
  ConfigurationProps,
  ToolbarColorMenu,
  ToolbarDropdownMenu,
} from "@vivid/builder";
import {
  Baseline,
  MoveDiagonal2,
  MoveHorizontal,
  PaintbrushVertical,
  PaintBucket,
  Pill,
  RectangleHorizontal,
  SquareRoundCorner,
} from "lucide-react";
import { FontFamilyDropdownMenu } from "../../toolbars/font-family";
import { FontSizeToolbarMenu } from "../../toolbars/font-size";
import { FontWeightDropdownMenu } from "../../toolbars/font-weight";
import { TextAlignDropdownMenu } from "../../toolbars/text-align";
import { ButtonProps, ButtonPropsDefaults } from "./schema";

const styleItems = [
  {
    icon: <SquareRoundCorner />,
    value: "rounded",
    label: "Rounded",
  },
  {
    icon: <RectangleHorizontal />,
    value: "rectangle",
    label: "Rectangle",
  },
  {
    icon: <Pill />,
    value: "pill",
    label: "Pill",
  },
];

const sizeItems = [
  {
    value: "x-small",
    label: "X-Small",
  },
  {
    value: "small",
    label: "Small",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "large",
    label: "Large",
  },
];

const widthItems = [
  {
    value: "auto",
    label: "Auto",
  },
  {
    value: "full",
    label: "Full width",
  },
];

export const ButtonToolbar = (props: ConfigurationProps<ButtonProps>) => (
  <>
    <TextAlignDropdownMenu
      {...props}
      defaultValue={ButtonPropsDefaults.style.textAlign}
    />
    <FontWeightDropdownMenu
      {...props}
      defaultValue={ButtonPropsDefaults.style.fontWeight}
    />
    <FontFamilyDropdownMenu {...props} />
    <FontSizeToolbarMenu
      {...props}
      defaultValue={ButtonPropsDefaults.style.fontSize}
    />
    <ToolbarDropdownMenu
      items={styleItems}
      defaultValue={ButtonPropsDefaults.props.buttonStyle}
      property="props.buttonStyle"
      tooltip="Style"
      {...props}
    />
    <ToolbarDropdownMenu
      icon={<MoveDiagonal2 />}
      items={sizeItems}
      defaultValue={ButtonPropsDefaults.props.size}
      property="props.size"
      tooltip="Size"
      {...props}
    />
    <ToolbarDropdownMenu
      icon={<MoveHorizontal />}
      items={widthItems}
      defaultValue={ButtonPropsDefaults.props.width}
      property="props.width"
      tooltip="Size"
      {...props}
    />
    <ToolbarColorMenu
      icon={<Baseline />}
      defaultValue={ButtonPropsDefaults.props.buttonTextColor}
      property="props.buttonTextColor"
      tooltip="Text color"
      {...props}
    />
    <ToolbarColorMenu
      icon={<PaintbrushVertical />}
      defaultValue={ButtonPropsDefaults.props.buttonBackgroundColor}
      property="props.buttonBackgroundColor"
      tooltip="Button color"
      {...props}
    />
    <ToolbarColorMenu
      icon={<PaintBucket />}
      property="style.backgroundColor"
      nullable
      tooltip="Background color"
      {...props}
    />
  </>
);
