import { ConfigurationProps, ToolbarColorMenu } from "@vivid/builder";
import { Brush, PaintBucket } from "lucide-react";
import { ContainerProps } from "./schema";

export const ContainerToolbar = (props: ConfigurationProps<ContainerProps>) => (
  <>
    <ToolbarColorMenu
      icon={<PaintBucket />}
      property="style.backgroundColor"
      nullable
      tooltip="Background color"
      {...props}
    />
    <ToolbarColorMenu
      nullable
      icon={<Brush />}
      property="style.borderColor"
      tooltip="Border color"
      {...props}
    />
  </>
);
