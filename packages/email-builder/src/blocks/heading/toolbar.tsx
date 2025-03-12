import {
  ConfigurationProps,
  ToolbarColorMenu,
  ToolbarDropdownMenu,
} from "@vivid/builder";
import {
  Baseline,
  Heading1,
  Heading2,
  Heading3,
  PaintBucket,
} from "lucide-react";
import { FontFamilyDropdownMenu } from "../../toolbars/font-family";
import { FontSizeToolbarMenu } from "../../toolbars/font-size";
import { FontWeightDropdownMenu } from "../../toolbars/font-weight";
import { TextAlignDropdownMenu } from "../../toolbars/text-align";
import { HeadingProps, HeadingPropsDefaults } from "./schema";
import { getFontSize } from "./styles";

const levelItems = [
  {
    icon: <Heading1 />,
    value: "h1",
    label: "H1",
  },
  {
    icon: <Heading2 />,
    value: "h2",
    label: "H2",
  },
  {
    icon: <Heading3 />,
    value: "h3",
    label: "H3",
  },
];
export const HeadingToolbar = (props: ConfigurationProps<HeadingProps>) => (
  <>
    <TextAlignDropdownMenu
      {...props}
      defaultValue={HeadingPropsDefaults.style.textAlign}
    />
    <ToolbarDropdownMenu
      items={levelItems}
      defaultValue={HeadingPropsDefaults.props.level}
      property="props.level"
      tooltip="Level"
      {...props}
    />
    <FontWeightDropdownMenu
      {...props}
      defaultValue={HeadingPropsDefaults.style.fontWeight}
    />
    <FontFamilyDropdownMenu {...props} />
    <FontSizeToolbarMenu
      {...props}
      defaultValue={getFontSize(
        props.data.props?.level || HeadingPropsDefaults.props.level
      )}
    />
    <ToolbarColorMenu
      icon={<Baseline />}
      nullable
      property="style.color"
      tooltip="Text color"
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
