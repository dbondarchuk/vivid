import {
  ConfigurationProps,
  NumberInputToolbarMenu,
  ToolbarColorMenu,
} from "@vivid/builder";
import { PaintBucket } from "lucide-react";
import { SpacerProps, SpacerPropsDefaults } from "./schema";

const heightOptions = [4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 96, 128];

export const SpacerToolbar = (props: ConfigurationProps<SpacerProps>) => (
  <>
    <NumberInputToolbarMenu
      defaultValue={SpacerPropsDefaults.props.height}
      property="props.height"
      tooltip="Height"
      options={heightOptions}
      min={4}
      max={128}
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
