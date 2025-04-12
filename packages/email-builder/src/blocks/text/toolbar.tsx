import { ConfigurationProps, ToolbarColorMenu } from "@vivid/builder";
import { Baseline, PaintBucket } from "lucide-react";
import { FontFamilyDropdownMenu } from "../../toolbars/font-family";
import { FontWeightDropdownMenu } from "../../toolbars/font-weight";
import { TextProps, TextPropsDefaults } from "./schema";

export const TextToolbar = (props: ConfigurationProps<TextProps>) => (
  <>
    <FontWeightDropdownMenu
      {...props}
      defaultValue={TextPropsDefaults.style.fontWeight}
    />
    <FontFamilyDropdownMenu {...props} />
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
