"use client";

import { BooleanInput, ConfigurationProps } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { Checkbox, Label } from "@vivid/ui";
import { ColorExtendedInput } from "../../style-inputs/base/color-exteneded-input";
import { COLORS } from "../../style/helpers/colors";
import { fontFamilyStyle } from "../../style/styles/typography/font-family";
import { PageLayoutDefaultProps, PageLayoutProps } from "./schema";
import { backgroundColorStyle } from "../../style/styles/background/background-color";
import { colorStyle } from "../../style/styles/typography/color";

export const PageLayoutConfiguration = ({
  data,
  setData,
}: ConfigurationProps<PageLayoutProps>) => {
  const updateData = (d: unknown) => setData(d as PageLayoutProps);
  const t = useI18n("builder");

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>{t("pageBuilder.styles.properties.backgroundColor")}</Label>
        <backgroundColorStyle.component
          value={data.backgroundColor ?? COLORS.background.value}
          onChange={(backgroundColor) =>
            updateData({ ...data, backgroundColor })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t("pageBuilder.styles.properties.fontFamily")}</Label>
        <fontFamilyStyle.component
          value={data.fontFamily}
          onChange={(fontFamily) => updateData({ ...data, fontFamily })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t("pageBuilder.styles.properties.color")}</Label>
        <colorStyle.component
          value={data.textColor ?? COLORS.foreground.value}
          onChange={(textColor) => updateData({ ...data, textColor })}
        />
      </div>
      <div className="flex items-center gap-2 flex-1">
        <Checkbox
          id="fullWidth"
          checked={data.fullWidth ?? PageLayoutDefaultProps.fullWidth}
          onCheckedChange={(fullWidth) => updateData({ ...data, fullWidth })}
        />
        <Label htmlFor="fullWidth">
          {t("pageBuilder.blocks.pageLayout.fullWidth")}
        </Label>
      </div>
    </>
  );
};
