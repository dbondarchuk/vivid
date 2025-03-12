import {
  ConfigurationProps,
  NumberInputToolbarMenu,
  ToolbarColorMenu,
} from "@vivid/builder";
import { Brush, PaintBucket } from "lucide-react";
import { DividerProps, DividerPropsDefaults } from "./schema";

const lineHeightOptions = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24];

export const DividerToolbar = (props: ConfigurationProps<DividerProps>) => (
  <>
    <ToolbarColorMenu
      icon={<Brush />}
      defaultValue={DividerPropsDefaults.props.lineColor}
      property="props.lineColor"
      tooltip="Line color"
      {...props}
    />
    <NumberInputToolbarMenu
      defaultValue={DividerPropsDefaults.props.lineHeight}
      property="props.lineHeight"
      tooltip="Line height"
      options={lineHeightOptions}
      min={1}
      max={24}
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
