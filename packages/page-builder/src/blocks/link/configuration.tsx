"use client";

import { ConfigurationProps, SelectInput, TextInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { LinkDefaultTarget, LinkDefaultUrl, LinkProps } from "./schema";
import { linkShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const LinkConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<LinkProps>) => {
  const updateData = (d: unknown) => setData(d as LinkProps);
  const t = useI18n("builder");

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={linkShortcuts}
      base={base}
      onBaseChange={onBaseChange}
    >
      <TextInput
        label={t("pageBuilder.blocks.link.url")}
        defaultValue={data.props?.url ?? LinkDefaultUrl}
        onChange={(url) => {
          updateData({ ...data, props: { ...data.props, url } });
        }}
      />
      <SelectInput
        label={t("pageBuilder.blocks.link.target")}
        defaultValue={data.props?.target ?? LinkDefaultTarget}
        onChange={(target) => {
          updateData({ ...data, props: { ...data.props, target } });
        }}
        options={[
          { value: "_self", label: t("pageBuilder.blocks.link.targets._self") },
          {
            value: "_blank",
            label: t("pageBuilder.blocks.link.targets._blank"),
          },
        ]}
      />
    </StylesConfigurationPanel>
  );
};
