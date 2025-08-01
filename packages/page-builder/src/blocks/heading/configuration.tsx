"use client";

import { ConfigurationProps, SelectInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { deepMemo } from "@vivid/ui";
import { useCallback } from "react";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { DefaultHeadingLevel, HeadingProps } from "./schema";
import { headingShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const HeadingConfiguration = deepMemo(
  ({ data, setData, base, onBaseChange }: ConfigurationProps<HeadingProps>) => {
    const updateProps = useCallback(
      (p: unknown) => setData({ ...data, props: p as HeadingProps["props"] }),
      [setData, data]
    );
    const updateStyle = useCallback(
      (s: unknown) => setData({ ...data, style: s as HeadingProps["style"] }),
      [setData, data]
    );
    const t = useI18n("builder");

    return (
      <StylesConfigurationPanel
        styles={data.style ?? {}}
        onStylesChange={updateStyle}
        availableStyles={styles}
        shortcuts={headingShortcuts}
        base={base}
        onBaseChange={onBaseChange}
      >
        <SelectInput
          label={t("pageBuilder.blocks.heading.level")}
          defaultValue={data.props?.level ?? DefaultHeadingLevel}
          onChange={(level) => {
            updateProps({ ...data.props, level });
          }}
          options={[
            { value: "h1", label: t("pageBuilder.blocks.heading.levels.h1") },
            { value: "h2", label: t("pageBuilder.blocks.heading.levels.h2") },
            { value: "h3", label: t("pageBuilder.blocks.heading.levels.h3") },
            { value: "h4", label: t("pageBuilder.blocks.heading.levels.h4") },
            { value: "h5", label: t("pageBuilder.blocks.heading.levels.h5") },
            { value: "h6", label: t("pageBuilder.blocks.heading.levels.h6") },
          ]}
        />
      </StylesConfigurationPanel>
    );
  }
);
