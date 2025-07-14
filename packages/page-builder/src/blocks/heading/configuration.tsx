"use client";

import {
  ConfigurationProps,
  RadioGroupInput,
  RadioGroupInputItem,
  SelectInput,
  TextInput,
} from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { HeadingProps, HeadingPropsDefaults } from "./schema";
import { styles } from "./styles";
import { headingShortcuts } from "./shortcuts";
import { Combobox } from "@vivid/ui";

export const HeadingConfiguration = ({
  data,
  setData,
}: ConfigurationProps<HeadingProps>) => {
  const updateData = (d: unknown) => setData(d as HeadingProps);
  const t = useI18n("builder");

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={headingShortcuts}
    >
      {/* <TextInput
        label={t("pageBuilder.blocks.heading.content")}
        rows={3}
        defaultValue={data.props?.text ?? HeadingPropsDefaults.props.text}
        onChange={(text) => {
          updateData({ ...data, props: { ...data.props, text } });
        }}
      /> */}
      <SelectInput
        label={t("pageBuilder.blocks.heading.level")}
        defaultValue={data.props?.level ?? HeadingPropsDefaults.props.level}
        onChange={(level) => {
          updateData({ ...data, props: { ...data.props, level } });
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
};
