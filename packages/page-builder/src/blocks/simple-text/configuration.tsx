"use client";

import { ConfigurationProps, TextInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { SimpleTextProps } from "./schema";
import { simpleTextShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const SimpleTextConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<SimpleTextProps>) => {
  const updateData = (d: unknown) => setData(d as SimpleTextProps);
  const t = useI18n("builder");

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={simpleTextShortcuts}
      base={base}
      onBaseChange={onBaseChange}
    >
      <TextInput
        label={t("pageBuilder.blocks.simpleText.url")}
        defaultValue={data.props?.url ?? ""}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, url: value } })
        }
      />
    </StylesConfigurationPanel>
  );
};
