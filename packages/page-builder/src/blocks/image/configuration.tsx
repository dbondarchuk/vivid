"use client";

import {
  ConfigurationProps,
  FileInput,
  PageInput,
  TextInput,
} from "@vivid/builder";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { ImageProps } from "./schema";
import { styles } from "./styles";
import { imageShortcuts } from "./shortcuts";
import { useI18n } from "@vivid/i18n";

export const ImageConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<ImageProps>) => {
  const updateData = (d: unknown) => setData(d as ImageProps);

  const t = useI18n("builder");

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={imageShortcuts}
      base={base}
      onBaseChange={onBaseChange}
    >
      <FileInput
        label={t("pageBuilder.blocks.image.imageUrl")}
        accept="image/*"
        defaultValue={data.props?.src ?? ""}
        onChange={(v) => {
          const src = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, src } });
        }}
      />

      <TextInput
        label={t("pageBuilder.blocks.image.altText")}
        defaultValue={data.props?.alt ?? ""}
        onChange={(alt) =>
          updateData({ ...data, props: { ...data.props, alt } })
        }
      />
      <PageInput
        label={t("pageBuilder.blocks.image.clickThroughUrl")}
        defaultValue={data.props?.linkHref ?? ""}
        onChange={(v) => {
          const linkHref = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, linkHref } });
        }}
      />
    </StylesConfigurationPanel>
  );
};
