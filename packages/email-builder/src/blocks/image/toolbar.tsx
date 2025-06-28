import { ConfigurationProps, ToolbarColorMenu } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { PaintBucket } from "lucide-react";
import { ContentAlignmentDropdownMenu } from "../../toolbars/content-alignment";
import { TextAlignDropdownMenu } from "../../toolbars/text-align";
import { ImageProps, ImagePropsDefaults } from "./schema";

export const ImageToolbar = (props: ConfigurationProps<ImageProps>) => {
  const t = useI18n("builder");

  return (
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
        tooltip={t("emailBuilder.blocks.image.backgroundColor")}
        {...props}
      />
    </>
  );
};
