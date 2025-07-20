"use client";

import { ConfigurationProps, SelectInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { AccordionProps } from "./schema";
import { styles } from "./styles";

export const AccordionConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<AccordionProps>) => {
  const updateData = (d: unknown) => setData(d as AccordionProps);
  const t = useI18n("builder");

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      base={base}
      onBaseChange={onBaseChange}
    >
      <SelectInput
        label={t("pageBuilder.blocks.accordion.animation")}
        size="sm"
        defaultValue={data.props.animation ?? "none"}
        onChange={(animation) =>
          updateData({ ...data, props: { ...data.props, animation } })
        }
        options={[
          {
            value: "slide",
            label: t("pageBuilder.blocks.accordion.animations.slide"),
          },
          {
            value: "fade",
            label: t("pageBuilder.blocks.accordion.animations.fade"),
          },
          {
            value: "none",
            label: t("pageBuilder.blocks.accordion.animations.none"),
          },
        ]}
      />
      <SelectInput
        label={t("pageBuilder.blocks.accordion.iconPosition")}
        size="sm"
        defaultValue={data.props.iconPosition ?? "right"}
        onChange={(iconPosition) =>
          updateData({ ...data, props: { ...data.props, iconPosition } })
        }
        options={[
          {
            value: "left",
            label: t("pageBuilder.blocks.accordion.iconPositions.left"),
          },
          {
            value: "right",
            label: t("pageBuilder.blocks.accordion.iconPositions.right"),
          },
        ]}
      />
      <SelectInput
        label={t("pageBuilder.blocks.accordion.iconStyle")}
        size="sm"
        defaultValue={data.props.iconStyle ?? "chevron"}
        onChange={(iconStyle) =>
          updateData({ ...data, props: { ...data.props, iconStyle } })
        }
        options={[
          {
            value: "plus",
            label: t("pageBuilder.blocks.accordion.iconStyles.plus"),
          },
          {
            value: "arrow",
            label: t("pageBuilder.blocks.accordion.iconStyles.arrow"),
          },
          {
            value: "chevron",
            label: t("pageBuilder.blocks.accordion.iconStyles.chevron"),
          },
        ]}
      />
    </StylesConfigurationPanel>
  );
};
