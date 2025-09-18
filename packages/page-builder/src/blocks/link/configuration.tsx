"use client";

import { ConfigurationProps, PageInput, SelectInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { deepMemo } from "@vivid/ui";
import { useCallback } from "react";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { LinkDefaultTarget, LinkDefaultUrl, LinkProps } from "./schema";
import { linkShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const LinkConfiguration = deepMemo(
  ({ data, setData, base, onBaseChange }: ConfigurationProps<LinkProps>) => {
    const updateStyle = useCallback(
      (s: unknown) => setData({ ...data, style: s as LinkProps["style"] }),
      [setData, data],
    );

    const updateProps = useCallback(
      (p: unknown) => setData({ ...data, props: p as LinkProps["props"] }),
      [setData, data],
    );
    const t = useI18n("builder");

    return (
      <StylesConfigurationPanel
        styles={data.style ?? {}}
        onStylesChange={updateStyle}
        availableStyles={styles}
        shortcuts={linkShortcuts}
        base={base}
        onBaseChange={onBaseChange}
      >
        <PageInput
          label={t("pageBuilder.blocks.link.url")}
          defaultValue={data.props?.url ?? LinkDefaultUrl}
          onChange={(url) => {
            updateProps({ ...data.props, url });
          }}
        />
        <SelectInput
          label={t("pageBuilder.blocks.link.target")}
          defaultValue={data.props?.target ?? LinkDefaultTarget}
          onChange={(target) => {
            updateProps({ ...data.props, target });
          }}
          options={[
            {
              value: "_self",
              label: t("pageBuilder.blocks.link.targets._self"),
            },
            {
              value: "_blank",
              label: t("pageBuilder.blocks.link.targets._blank"),
            },
          ]}
        />
      </StylesConfigurationPanel>
    );
  },
);
