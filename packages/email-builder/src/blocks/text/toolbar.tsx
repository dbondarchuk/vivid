import { ConfigurationProps, ToolbarColorMenu } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { Baseline, PaintBucket } from "lucide-react";
import { FontFamilyDropdownMenu } from "../../toolbars/font-family";
import { FontWeightDropdownMenu } from "../../toolbars/font-weight";
import { TextProps, TextPropsDefaults } from "./schema";

export const TextToolbar = (props: ConfigurationProps<TextProps>) => {
  const t = useI18n("builder");

  return (
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
        tooltip={t("emailBuilder.blocks.text.textColor")}
        {...props}
      />
      <ToolbarColorMenu
        icon={<PaintBucket />}
        property="style.backgroundColor"
        nullable
        tooltip={t("emailBuilder.blocks.text.backgroundColor")}
        {...props}
      />
    </>
  );
};
