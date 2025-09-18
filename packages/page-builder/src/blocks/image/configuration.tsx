"use client";

import {
  ConfigurationProps,
  FileInput,
  PageInput,
  TextInput,
} from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { deepMemo } from "@vivid/ui";
import { useCallback } from "react";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { ImageProps } from "./schema";
import { imageShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const ImageConfiguration = deepMemo(
  ({ data, setData, base, onBaseChange }: ConfigurationProps<ImageProps>) => {
    const updateProps = useCallback(
      (p: unknown) => setData({ ...data, props: p as ImageProps["props"] }),
      [setData, data],
    );
    const updateStyle = useCallback(
      (s: unknown) => setData({ ...data, style: s as ImageProps["style"] }),
      [setData, data],
    );

    const t = useI18n("builder");

    return (
      <StylesConfigurationPanel
        styles={data.style ?? {}}
        onStylesChange={updateStyle}
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
            updateProps({ ...data.props, src });
          }}
        />

        <TextInput
          label={t("pageBuilder.blocks.image.altText")}
          defaultValue={data.props?.alt ?? ""}
          onChange={(alt) => updateProps({ ...data.props, alt })}
        />
        <PageInput
          label={t("pageBuilder.blocks.image.clickThroughUrl")}
          defaultValue={data.props?.linkHref ?? ""}
          onChange={(v) => {
            const linkHref = v.trim().length === 0 ? null : v.trim();
            updateProps({ ...data.props, linkHref });
          }}
        />
      </StylesConfigurationPanel>
    );
  },
);
