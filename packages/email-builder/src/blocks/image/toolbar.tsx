import {
  ConfigurationProps,
  ToolbarColorMenu,
  ToolbarDropdownMenu,
} from "@vivid/builder";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  FoldVertical,
  PaintBucket,
} from "lucide-react";
import { TextAlignDropdownMenu } from "../../toolbars/text-align";
import { AvatarPropsDefaults } from "../avatar";
import { ImageProps, ImagePropsDefaults } from "./schema";
import { ContentAlignmentDropdownMenu } from "../../toolbars/content-alignment";

export const ImageToolbar = (props: ConfigurationProps<ImageProps>) => (
  <>
    <TextAlignDropdownMenu
      {...props}
      defaultValue={ImagePropsDefaults.style.textAlign}
    />
    <ContentAlignmentDropdownMenu
      defaultValue={ImagePropsDefaults.props.contentAlignment}
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
